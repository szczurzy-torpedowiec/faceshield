using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using Microsoft.Kinect;
using System.Windows;
using System.Linq;
using System.Runtime.InteropServices;

namespace FaceShieldKinectModule
{
    public static class SkeletonSerializer
    {
        [DataContract]
        class JSONSkeleton
        {
            [DataMember(Name = "headTop")]
            public JSONJoint headTop { get; set; }

            [DataMember(Name = "headBottom")]
            public JSONJoint headBottom { get; set; }

            [DataMember(Name = "handLeft")]
            public JSONJoint handLeft { get; set; }

            [DataMember(Name = "handRight")]
            public JSONJoint handRight { get; set; }
        }

        [DataContract]
        class JSONJoint
        {
            [DataMember(Name = "x")]
            public double X { get; set; }

            [DataMember(Name = "y")]
            public double Y { get; set; }

            [DataMember(Name = "z")]
            public double Z { get; set; }
        }

        public static string Serialize(this List<Skeleton> skeletons, CoordinateMapper mapper)
        {
            JSONSkeleton jsonSkeleton = new JSONSkeleton
            {
                handLeft = new JSONJoint(),
                handRight = new JSONJoint(),
                headTop = new JSONJoint(),
                headBottom = new JSONJoint()
            };
            var skeleton = skeletons.First();
            List<JSONJoint> Joints = new List<JSONJoint>();
            foreach (Joint joint in skeleton.Joints)
            {
                Point point = new Point();

                ColorImagePoint colorPoint = mapper.MapSkeletonPointToColorPoint(joint.Position, ColorImageFormat.RgbResolution640x480Fps30);
                point.X = colorPoint.X;
                point.Y = colorPoint.Y;

                JSONJoint jointToAdd = new JSONJoint
                {
                    X = point.X,
                    Y = point.Y,
                    Z = joint.Position.Z
                };
                switch (joint.JointType.ToString().ToLower()) {
                    case "handleft":
                        jsonSkeleton.handLeft = jointToAdd;
                        break;
                    case "handright":
                        jsonSkeleton.handRight = jointToAdd;
                        break;
                    case "head":
                        jsonSkeleton.headTop = jointToAdd;
                        break;
                    case "shouldercenter":
                        jsonSkeleton.headBottom = jointToAdd;
                        break;
                }
                }
            return Serialize(jsonSkeleton);
        }


        private static string Serialize(object obj)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(obj.GetType());

            using (MemoryStream ms = new MemoryStream())
            {
                serializer.WriteObject(ms, obj);

                return Encoding.Default.GetString(ms.ToArray());
            }
        }
    }
}
