using FaceShieldKinectModule.Properties;
using System;
using System.Windows.Forms;

namespace FaceShieldKinectModule
{
    class ProcessIcon
    {
        static NotifyIcon ni;
        public void initTaskbarIcon()
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
