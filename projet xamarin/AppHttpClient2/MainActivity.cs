using Android.App;
using Android.OS;
using Android.Runtime;
using Android.Widget;
using AndroidX.AppCompat.App;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Net.Http;
using Xamarin.Essentials;

namespace AppHttpclient2
{
    [Activity(Label = "@string/app_name", Theme = "@style/AppTheme", MainLauncher = true)]
    public class MainActivity : AppCompatActivity
    {
        HttpClient client;
        List<Velib> listVelib;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            var uri = "https://opendata.paris.fr/api/records/1.0/search/?dataset=velib-disponibilite-en-temps-reel&q=&facet=name&facet=is_installed&facet=is_renting&facet=is_returning&facet=nom_arrondissement_communes";
            base.OnCreate(savedInstanceState);
            Xamarin.Essentials.Platform.Init(this, savedInstanceState);
            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.activity_main);
            Button btn1 = FindViewById<Button>(Resource.Id.button1);
            btn1.Click += (object sender, EventArgs e) =>
            {
                client = new HttpClient();
                client.BaseAddress = new Uri(uri);
                recupAPI(uri);
            };

        }
        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Android.Content.PM.Permission[] grantResults)
        {
            Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
        }

        public async void recupAPI(string uri)
        {
            HttpResponseMessage response = await client.GetAsync(uri);

            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                JObject json = JObject.Parse(content);
                var test = json.Property("records").Value;
                var finaltest = test.ToString();

                ListView lst1 = FindViewById<ListView>(Resource.Id.listView1);
                listVelib = JsonConvert.DeserializeObject<List<Velib>>(finaltest);
                List<string> items = new List<String>();
                ArrayList items2 = new ArrayList();
                ArrayList items3 = new ArrayList();
                foreach (var en in listVelib)
                {
                    items.Add(en.fields.name);
                    items2.Add(en.geometry.coordinates[0]);
                    items3.Add(en.geometry.coordinates[1]);
                }
                var ListAdapter = new ArrayAdapter<String>(this, Android.Resource.Layout.SimpleListItem1, items);
                lst1.SetAdapter(ListAdapter);
                lst1.ItemClick += OnClickItem;
                async void OnClickItem(object sender, AdapterView.ItemClickEventArgs e)
                {
                    //On récupère le nom et les coordonnées de l'item sélectionné
                    string nom = (string)lst1.GetItemAtPosition(e.Position);
                    double longitude = (double)items2[e.Position];
                    double latitude = (double)items3[e.Position];
                    //On ouvre la google map si possible sinon la map native du téléphone
                    var supportsUri = await Launcher.CanOpenAsync("comgooglemaps://");
                    if (supportsUri)
                    {
                        await Launcher.OpenAsync($"comgooglemaps://?q={latitude},{longitude}({nom})");
                    } 
                    else
                    {
                        await Map.OpenAsync(latitude, longitude, new MapLaunchOptions { Name = nom });
                    }
                }
            }
        }
    }
}