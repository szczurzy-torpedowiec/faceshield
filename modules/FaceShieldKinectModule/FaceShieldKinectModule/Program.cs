using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Kinect;
using System.Windows.Forms;
using FaceShieldKinectModule.Properties;

namespace FaceShieldKinectModule
{
    class Program
    {
        static List<IWebSocketConnection> _clients = new List<IWebSocketConnection>();
        static Skeleton[] _skeletons = new Skeleton[6];
        static CoordinateMapper _coordinateMapper;
        static KinectSensor sensor;

        static void Main(string[] args)
        {
            InitializeConnection();
            InitilizeKinect();
            initTaskbarIcon();
            Application.Run();
        }
        private static void InitializeConnection()
        {
            var server = new WebSocketServer("ws://0.0.0.0:8181");

            server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    _clients.Add(socket);
                };

                socket.OnClose = () =>
                {
                    _clients.Remove(socket);
                };

                socket.OnMessage = message =>
                {
                    string[] msgArgs = message.Split(':');
                    if (msgArgs[0] == "tilt" && Convert.ToInt32(msgArgs[1]) >= sensor.MinElevationAngle && Convert.ToInt32(msgArgs[1]) <= sensor.MaxElevationAngle)
                    {
                        sensor.ElevationAngle = Convert.ToInt32(msgArgs[1]);
                    }
                };
            });
        }

        private static void InitilizeKinect()
        {
            sensor = KinectSensor.KinectSensors.SingleOrDefault();
            if (sensor != null)
            {
                sensor.ColorStream.Enable();
                sensor.DepthStream.Enable();
                sensor.SkeletonStream.Enable();

                sensor.AllFramesReady += Sensor_AllFramesReady;

                _coordinateMapper = sensor.CoordinateMapper;

                sensor.Start();
            }
        }

        static void Sensor_AllFramesReady(object sender, AllFramesReadyEventArgs e)
        {
            using (var frame = e.OpenColorImageFrame())
            {
                if (frame != null)
                {
                        var image = frame.Serialize();

                        foreach (var socket in _clients)
                        {
                            socket.Send(image);
                        }
                }
            }

            using (var frame = e.OpenSkeletonFrame())
            {
                if (frame != null)
                {
                    frame.CopySkeletonDataTo(_skeletons);

                    var users = _skeletons.Where(s => s.TrackingState == SkeletonTrackingState.Tracked).ToList();

                    if (users.Count > 0)
                    {
                        string json = users.Serialize(_coordinateMapper);

                        foreach (var socket in _clients)
                        {
                            socket.Send(json);
                        }
                    }
                }
            }
        }

        static NotifyIcon ni;
        static public void initTaskbarIcon()
        {
            ni = new NotifyIcon()
            {
                Icon = Resources.AppIcon,
                ContextMenu = new ContextMenu(new MenuItem[] {
                new MenuItem("Exit", Exit)
            }),
                Visible = true
            };
        }
        static void Exit(object sender, EventArgs e)
        {
            ni.Visible = false;

            Application.Exit();
        }
    }
}
