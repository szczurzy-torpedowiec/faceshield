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
            [DataMember(Name = "head")]
            public JSONArea head { get; set; }

            [DataMember(Name = "hands")]
            public List<JSONJoint> hands { get; set; }
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

        [DataContract]
        class JSONArea
        {
            [DataMember(Name = "x")]
            public double X { get; set; }

            [DataMember(Name = "dx")]
            public double DX { get; set; }

            [DataMember(Name = "y")]
            public double Y { get; set; }

            [DataMember(Name = "dy")]
            public double DY { get; set; }

            [DataMember(Name = "z")]
            public double Z { get; set; }
        }

        public static string Serialize(this List<Skeleton> skeletons, CoordinateMapper mapper)
        {
            JSONSkeleton jsonSkeleton = new JSONSkeleton
            {
                head = new JSONArea(),
                hands = new List<JSONJoint>()
            };
            JSONJoint headTop = new JSONJoint();
            JSONJoint headBottom = new JSONJoint();
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
                        jsonSkeleton.hands.Add(jointToAdd);
                        break;
                    case "handright":
                        jsonSkeleton.hands.Add(jointToAdd);
                        break;
                    case "head":
                        headTop = jointToAdd;
                        break;
                    case "shouldercenter":
                        headBottom = jointToAdd;
                        break;
                }
                }
            double headSize = headBottom.Y - headTop.Y;
            jsonSkeleton.head.X = headBottom.X - (headSize / 2);
            jsonSkeleton.head.Y = headBottom.Y;
            jsonSkeleton.head.DX = headSize;
            jsonSkeleton.head.DY = -headSize;
            jsonSkeleton.head.Z = (headTop.Z + headBottom.Z) / 2;
            return objToJson(jsonSkeleton);
        }


        public static string objToJson(object obj)
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
