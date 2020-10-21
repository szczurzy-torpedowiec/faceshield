using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Kinect;
using System.Windows.Forms;
using FaceShieldKinectModule.Properties;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;

namespace FaceShieldKinectModule
{
    class Program
    {
        static List<IWebSocketConnection> _clients = new List<IWebSocketConnection>();
        static Skeleton[] _skeletons = new Skeleton[6];
        static CoordinateMapper _coordinateMapper;
        static KinectSensor sensor;
        static int port;

        [DataContract]
        class SocketMessage
        {
            [DataMember(Name = "type")]
            public string type { get; set; }

            [DataMember(Name = "data")]
            public string data { get; set; }
        }

        static int Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Please enter a port number");
                return 1;
            }
            port = Convert.ToInt32(args[0]);
            InitializeConnection();
            InitilizeKinect();
            Application.Run();
            return 0;
        }
        private static void InitializeConnection()
        {
            var server = new WebSocketServer("ws://0.0.0.0:" + port);

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
                    var message = jsonSocketMessage("image", image);

                    foreach (var socket in _clients)
                    {
                        socket.Send(message);
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
                        var message = jsonSocketMessage("skeleton", json);

                        foreach (var socket in _clients)
                        {
                            socket.Send(message);
                        }
                    }
                }
            }
        }

        static string jsonSocketMessage(string type, string data)
        {
            SocketMessage socketMessage = new SocketMessage
            {
                type = type,
                data = data
            };
            return SkeletonSerializer.objToJson(socketMessage);
        }
    }
}
