import { Component } from '@angular/core';
//import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: Boolean;
  constructor(private bluetoothSerial: BluetoothSerial, private alertCtrl: AlertController) {
    bluetoothSerial.enable();
  }

  startScanning() {
    // alert("555");
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      this.unpairedDevices = success;
      this.gettingDevices = false;
      success.forEach(element => {
        // alert(element);
      });
    },
      (err) => {
        console.log(err);
      //  alert(err);
      })

    this.bluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
    },
      (err) => {
      //   alert(err);
      })
  }

  success = (data) => this.openPort()//alert("val : "+data);
  fail = (error) => alert("error : "+error);

  selectDevice(address: any) {

    let alert = this.alertCtrl.create({
      title: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
          }
        }
      ]
    });
    alert.present();

  }

  openPort(){
    this.bluetoothSerial.write('01 0C\r').then( (success) => {
        alert('Connected ' + '. Data reading is successful: ' + new Uint8Array(success));

    },
    (error) => {
        alert('reading failed:' + error );
    });

    this.bluetoothSerial.read().then((success) => {
        var bytes = new Uint8Array(success);
        console.log(bytes);
        alert('read : '+bytes);
    },
    (error) => {
        alert('reading failed:' + error );
    });
   }

  selectDevice2(device:any){
      this.bluetoothSerial.connect(device.id).subscribe(this.success, this.fail);
    //this.bluetoothSerial.connect(device.id,this.success, this.fail);



  /*  this.bluetoothSerial.read().then((success) => {
      var bytes = new Uint8Array(success);
      console.log(bytes);
      alert(id+' / '+bytes);
    },
      (err) => {
        console.log(err);
        alert(err);
      })*/

    //  this.bluetoothSerial.subscribeRawData(function (data) {


  }

  disconnect() {
    let alert = this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    alert.present();
  }


}
