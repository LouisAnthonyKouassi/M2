using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AppHttpclient2
{
    public class Velib
    {
        public string datasetid { get; set; }
        public string recordid { get; set; }
        public Fields fields { get; set; }
        public Geometry geometry { get; set; }
        public DateTime record_timestamp { get; set; }

        public class Fields
        {
            public string name { get; set; }
            public string stationcode { get; set; }
            public int ebike { get; set; }
            public int mechanical { get; set; }
            public List<double> coordonnees_geo { get; set; }
            public DateTime duedate { get; set; }
            public int numbikesavailable { get; set; }
            public int numdocksavailable { get; set; }
            public int capacity { get; set; }
            public string is_renting { get; set; }
            public string is_installed { get; set; }
            public string nom_arrondissement_communes { get; set; }
            public string is_returning { get; set; }
        }

        public class Geometry
        {
            public string type { get; set; }
            public List<double> coordinates { get; set; }
        }

    }
}