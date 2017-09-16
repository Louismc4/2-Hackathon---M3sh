//
//  LocationViewController.swift
//  m3sh
//
//  Created by Louis Moc on 2017-09-16.
//  Copyright © 2017 Louis Moc. All rights reserved.
//

import UIKit
import CoreLocation
import FBSDKLoginKit

class LocationViewController : UIViewController, CLLocationManagerDelegate, FBSDKLoginButtonDelegate {

    let locationManager = CLLocationManager()
        
    let loginButton : FBSDKLoginButton = {
        let button = FBSDKLoginButton()
        button.readPermissions = ["public_profile", "email"]
        return button
    }()
        
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        view.addSubview(loginButton)
        loginButton.center = view.center
        loginButton.delegate = self
        
        locationManager.requestAlwaysAuthorization()
        
        if CLLocationManager.locationServicesEnabled() {
            switch(CLLocationManager.authorizationStatus()) {
            case .notDetermined, .restricted, .denied:
                return
            case .authorizedAlways, .authorizedWhenInUse:
                //Get best location, request authorization, update location in the background, update location when moved (in meters), start updating
                locationManager.delegate = self
                locationManager.desiredAccuracy = kCLLocationAccuracyBest
                locationManager.distanceFilter = 1
            }
        }
    }
        
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
        
    @IBAction func start(_ sender: Any) {
        locationManager.startUpdatingLocation()
    }
        
    @IBAction func stop(_ sender: Any) {
        locationManager.stopUpdatingLocation()
    }
    
    var initLocation = CLLocation(latitude: 0, longitude: 0)
        
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let distanceInMeters = locations.last!.distance(from: initLocation)
        if(distanceInMeters > 1) {
            initLocation = locations.last!
            let currentLocation = CLLocationCoordinate2D(latitude: locations.last!.coordinate.latitude, longitude:
                locations.last!.coordinate.longitude)
            let altitude = locations.last!.altitude
                
            if let idvalue = UserDefaults.standard.object(forKey: "id") as? String {
                let data : [String:Any] = [
                    "id" : idvalue,
                    "latitude" : currentLocation.latitude,
                    "longitude" : currentLocation.longitude,
                    "altitude" : altitude]
                self.locationPost(params: data)
            }
        }
    }
        
    func loginButton(_ loginButton: FBSDKLoginButton!, didCompleteWith result: FBSDKLoginManagerLoginResult!, error: Error!) {
    }
    
    func loginButtonDidLogOut(_ loginButton: FBSDKLoginButton!) {
        UserDefaults.standard.set(0, forKey: "fetch")
        self.performSegue(withIdentifier: "unwindtologin", sender: self)
    }
        
    func loginButtonWillLogin(_ loginButton: FBSDKLoginButton!) -> Bool {
        return true
    }
        
    func locationPost(params: [String:Any]) {
        var request = URLRequest(url: URL(string: "https://m3sh-louismc4.c9users.io/location")!)
        request.httpMethod = "POST"
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: params, options: .prettyPrinted)
            request.httpBody = jsonData
        } catch {
            print(error.localizedDescription)
            return
        }
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                // check for fundamental networking error
                print("error=\(error)")
                return
            }
            
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode != 200 { // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(response)")
            }
            
            let responseString = String(data: data, encoding: .utf8)
            print("responseString = \(responseString)")
            
//            UIAlertView(title: "Status",
//                message: responseString!,
//                delegate: nil,
//                cancelButtonTitle: "OK").show()
        }
        task.resume()
    }
}
