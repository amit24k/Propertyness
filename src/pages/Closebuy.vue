<template>
<div class="ui grid vld-parent">
  <loading :active.sync="isLoading"
        :on-cancel="onCancel"
        :is-full-page="fullPage"></loading>
  <div class="six wide column" :class="{ centered: showInCenter }">
    <form class="ui segment large form">
      <div class="ui segment">
        <div class="field">
          <div class="ui right icon input large">
            <input type="text" placeholder="Enter your address" v-model="address" ref="autocomplete" />
            <i class="dot circle link icon red" @click="locatorButtonPressed"></i>
          </div>
          <div class="ui pointing blue basic label">
            Enter the Location or Press the button to fetch current location
          </div>
        </div>
        <!-- <div class="field">
          <div class="three fields"> -->
        <div class="field">
          <multiselect v-model="optionsValue" :options="options" :multiple="true" :close-on-select="false"  placeholder="Select Your Preference(s)" label="name" track-by="name">
            <!-- <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template> -->
          </multiselect>
          <!--<multiselect v-model="value" :options="options"></multiselect>
               <select v-model="type">
                <option value="atm">ATM</option>
                <option value="Bank">Bank</option>
                <option value="Book_store">Book store</option>
                <option value="cafe">Cafe</option>
                <option value="convenience_store">Convenience Store</option>
                <option value="Doctor">Doctor</option>
                <option value="gas_station">Gas Station</option>
                <option value="gym">Gym</option>
                <option value="hospital">Hospital</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="restaurant">Restaurant</option>
                <option value="School">School</option>
                <option value="shopping_mall">Shopping Mall</option>
                <option value="super_market">Super market</option>
              </select> -->
        </div>
        <div class="field">
          <multiselect v-model="radius" :options="radiusOptions" :searchable="false" :show-labels="false" placeholder="Select Radius (in Km)"></multiselect>
          <!-- <select v-model="radius">
                <option value="0.5">0.5 Km</option>
                <option value="1">1 Km</option>
                <option value="1.5">1.5 Km</option>
                <option value="2">2 Km</option>
                <option value="2.5">2.5 Km</option>
                <option value="3">3 Km</option>
                <option value="3.5">3.5 Km</option>
                <option value="4">4 Km</option>
                <option value="4.5">4.5 Km</option>
                <option value="5">5 Km</option>
              </select> -->
        </div>

        <!-- </div>
        </div> -->
        <button class="ui button blue"  @click="findCloseBuyButtonPressed(optionsValue[0].nameValue)">Find Nearby</button>
      </div>
    </form>
    <div class="ui segment" v-show="showSection"> <!-- v-bind:class="{ result_hide: resultHide }" -->
      <div class="field">
        <div class="ui input">
          <input type="text" placeholder="Overall Score" v-model="counter" />
        </div>
      </div>
      <div class="ui teal tag label large" style="margin-top:1rem">Overall Score (1-5)</div>
    </div>


  </div>
  <div class="ten wide column" v-show="showSection">
    <!-- <div class="ui segment"> -->

    <div class="ui segment" ref="map" style="height:450px">

    </div>

    <div class="violet ui inverted buttons" v-for="option in optionsValue" v-if="option.nameValue!=='crime_rate'">
      <button class="ui button" style="margin:0.5rem" @click="showOnMap(option.nameValue)">{{option.name}}</button>
    <!-- </div> -->

  </div>

  <div class="ui segment" v-show="showSection" style="max-height:400px;overflow:scroll">
    <div class="ui divided items">
      <div class="item" v-for="place in places" :key="place.id">
        <div class="content">
          <div class="header">{{place.name}}</div>
          <div class="meta">{{place.vicinity}}</div>
        </div>
      </div>
    </div>
  </div>

  </div>
</div>
</template>

<script>
import axios from "axios";
import Multiselect from 'vue-multiselect';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {
    Multiselect,
    Loading
  },
  data() {
    return {
      lat: null,
      lng: null,
      address: "",
      options: [{
          name: 'ATM',
          nameValue: 'atm'
        },
        {
          name: 'Bank',
          nameValue: 'bank'
        },
        {
          name: 'Book Store',
          nameValue: 'book_store'
        },
        {
          name: 'Cafe',
          nameValue: 'cafe'
        },
        {
          name: 'Convenience Store',
          nameValue: 'convenience_store'
        },
        {
          name: 'Crime Rate (Low)',
          nameValue: 'crime_rate'
        },
        {
          name: 'Doctor',
          nameValue: 'doctor'
        },
        {
          name: 'Gas Station',
          nameValue: 'gas_station'
        },
        {
          name: 'Gym',
          nameValue: 'gym'
        },
        {
          name: 'Hospital',
          nameValue: 'hospital'
        },
        {
          name: 'Pharmacy',
          nameValue: 'pharmacy'
        },
        {
          name: 'Restaurant',
          nameValue: 'restaurant'
        },
        {
          name: 'School',
          nameValue: 'school'
        },
        {
          name: 'Shopping Mall',
          nameValue: 'shopping_mall'
        },
        {
          name: 'Super Market',
          nameValue: 'super_market'
        }
      ],
      optionsValue: [],
      radiusOptions: ['0.5', '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'],
      type: "",
      radius: '',
      places: [],
      state: "",
      states: [{
          name: "Sikkim",
          crimeRate: 0.0
        },
        {
          name: "Nagaland",
          crimeRate: 0.0
        },
        {
          name: "Mizoram",
          crimeRate: 0.0
        },
        {
          name: "Tripura",
          crimeRate: 0.1
        },
        {
          name: "Meghalaya",
          crimeRate: 0.1
        },
        {
          name: "Manipur",
          crimeRate: 0.1
        },
        {
          name: "Goa",
          crimeRate: 0.1
        },
        {
          name: "Arunachal Pradesh",
          crimeRate: 0.1
        },
        {
          name: "Himachal Pradesh",
          crimeRate: 0.4
        },
        {
          name: "Jammu and Kashmir",
          crimeRate: 0.5
        },
        {
          name: "Uttarakhand",
          crimeRate: 0.7
        },
        {
          name: "Jharkhand",
          crimeRate: 1.1
        },
        {
          name: "Punjab",
          crimeRate: 1.4
        },
        {
          name: "Chhattisgarh",
          crimeRate: 1.9
        },
        {
          name: "Odisha",
          crimeRate: 2.1
        },
        {
          name: "Assam",
          crimeRate: 2.4
        },
        {
          name: "Telangana",
          crimeRate: 2.5
        },
        {
          name: "Andhra Pradesh",
          crimeRate: 2.9
        },
        {
          name: "Karnataka",
          crimeRate: 3.2
        },
        {
          name: "West Bengal",
          crimeRate: 3.7
        },
        {
          name: "Haryana",
          crimeRate: 3.8
        },
        {
          name: "Rajasthan",
          crimeRate: 4.9
        },
        {
          name: "Delhi",
          crimeRate: 5.2
        },
        {
          name: "Gujarat",
          crimeRate: 7.7
        },
        {
          name: "Madhya Pradesh",
          crimeRate: 8.0
        },
        {
          name: "Tamil Nadu",
          crimeRate: 9.8
        },
        {
          name: "Kerala",
          crimeRate: 10.1
        },
        {
          name: "Maharashtra",
          crimeRate: 10.2
        },
        {
          name: "Uttar Pradesh",
          crimeRate: 11.5
        }
      ],
      countAll: 0,
      showSection: false,
      showInCenter:true,
      isLoading: false,
      fullPage: true
    };
  },
  mounted() {
    this.autocomplete = new google.maps.places.Autocomplete(
      (this.$refs.autocomplete), {
        types: ['geocode']
      }
    );
    this.autocomplete.addListener('place_changed', () => {
      let place = this.autocomplete.getPlace();
      this.lat = place.geometry.location.lat();
      this.lng = place.geometry.location.lng();
      this.getStreetAddressFrom(this.lat, this.lng);
    });
  },
  computed: {
    // address() {
    //   return `${this.lat}, ${this.lng}`;
    // },
    counter() {
      return `${Math.round(this.countAll/this.optionsValue.length * 100) / 100}`;
    }
  },
  methods: {
    show(){
      if(this.showSection == false)
      this.showSection = true;
    },
    findRange(x, in_min, in_max, out_min, out_max) {
      return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    },
    async getStreetAddressFrom(lat, long) {
      try {
        var {
          data
        } = await axios.get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          lat +
          "," +
          long +
          "&key=ApiKey"
        );
        if (data.error_message) {
          console.log(data.error_message)
        } else {
          this.address = data.results[0].formatted_address;
          data.results[0].address_components.forEach((component) => {
            // if (component.types[0] == 'administrative_area_level_3') {
            //   this.address += (component.long_name+", ");
            // }
            if (component.types[0] == 'administrative_area_level_1') {
              this.state = component.long_name;
              // this.address += (this.state +", ");
            }
            // if (component.types[0] == 'country') {
            //   this.address += (component.long_name+", ");
            // }
            // if (component.types[0] == 'postal_code') {
            //   this.address += component.long_name;
            // }
          });
          // var param = data.results[0].address_components.length;
          // this.state = data.results[0].address_components[param-3].long_name;
          // alert(this.state);
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    // async locationFromAutocomplete() {
    //   try {
    //     var {
    //       data
    //     } = await axios.get(
    //       "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    //       this.address +
    //       "&key=ApiKey"
    //     );
    //     if (data.error_message) {
    //       console.log(data.error_message)
    //     } else {
    //       this.lat = data.results[0].geometry.location.lat;
    //       this.lng = data.results[0].geometry.location.lng;
    //     }
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // },
    locatorButtonPressed() {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.getStreetAddressFrom(this.lat = position.coords.latitude, this.lng = position.coords.longitude);
        },
        error => {
          console.log("Error getting location");
        }
      );
    },
    findCloseBuyButtonPressed(type) {
      this.isLoading = true;
      if (this.lat == null) {
        alert("Enter Location!");
        exit();
      }
      if (type != "crime_rate") {
        const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.lng}&type=${type}&radius=${this.radius *
        1000}&key=ApiKey`;
        axios.get(URL).then(response => {
          this.places = response.data.results;
          this.addLocationsToGoogleMaps();

        }).catch(error => {
          console.log(error);
        });
      }
      this.findForAll();
      setTimeout(() => {
                  this.isLoading = false
                },2000)
      this.show();

    },
    showOnMap(type) {
      this.isLoading = true;
      if (this.lat == null) {
        alert("Enter Location!");
        exit();
      }
      if (type != "crime_rate") {
        const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.lng}&type=${type}&radius=${this.radius *
        1000}&key=ApiKey`;
        axios.get(URL).then(response => {
          this.places = response.data.results;
          this.addLocationsToGoogleMaps();

        }).catch(error => {
          console.log(error);
        });
      }
      setTimeout(() => {
                  this.isLoading = false
                },1000)

    },

    // findRange(num) {
    //   return (num / 20) * 5;
    // },
    findForAll() {
      this.countAll = 0;
      this.optionsValue.forEach((type) => {
        if (type.nameValue == 'crime_rate') {
          // alert("found");
          this.states.forEach((state) => {
            if (this.state == state.name) {
              // alert("matched state!");
              var human = 100 - state.crimeRate;
              var count = this.findRange(human, 88.5, 100, 0, 5);
              // alert("found range"+count);
              this.countAll += count;
            }
            // alert("No state matched!");
          });
        } else {
          const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.lng}&type=${type.nameValue}&radius=${0.5 *
          1000}&key=ApiKey`;
          axios.get(URL).then(response => {
            var count = response.data.results.length;
            count = this.findRange(count, 0, 20, 0, 5);
            // alert(count);
            this.countAll += count;
          }).catch(error => {
            console.log(error);
          });
        }
      });
    },
    addLocationsToGoogleMaps() {
      var map = new google.maps.Map(this.$refs['map'], {
        zoom: 15,
        center: new google.maps.LatLng(this.lat, this.lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var infowindow = new google.maps.InfoWindow();

      this.places.forEach((place) => {
        const lat = place.geometry.location.lat;
        const lng = place.geometry.location.lng;
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map
        });
        google.maps.event.addListener(marker, "click", () => {
          infowindow.setContent(
            `<div class="ui header">${place.name}</div>
            <div class="description">${place.vicinity}</div>`);
          infowindow.open(map, marker);
        });
      });
    }
  }
};
</script>
