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

let LocationController = LocationViewController()

class LocationViewController : UIViewController, CLLocationManagerDelegate, FBSDKLoginButtonDelegate {
    
    class var LocationControllerInstance : LocationViewController {
        return LocationController
    }

    let locationManager = CLLocationManager()
    
    let loginButton : FBSDKLoginButton = {
        let button = FBSDKLoginButton()
        button.readPermissions = ["public_profile", "email"]
        return button
    }()
    
    @IBOutlet weak var safetySegment: UISegmentedControl!
        
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
    
    override func viewDidAppear(_ animated: Bool) {
        UserDefaults.standard.set(1, forKey: "status")
        safetySegment.selectedSegmentIndex = 1
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
        
    @IBAction func start(_ sender: Any) {
        locationManager.startUpdatingLocation()
    }
        
    @IBAction func stop(_ sender: Any) {
        locationManager.stopUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let currentLocation = CLLocationCoordinate2D(latitude: locations.last!.coordinate.latitude, longitude:
            locations.last!.coordinate.longitude)
        let altitude = locations.last!.altitude
        
        if let idvalue = UserDefaults.standard.object(forKey: "id") as? String {
            var data : [String:Any] = [
                "peers" : "",
                "type" : "location",
                "id" : idvalue,
                "latitude" : currentLocation.latitude,
                "longitude" : currentLocation.longitude,
                "altitude" : altitude]
            if(InternetManager.internetManager.isInternetAvailable()){
                self.locationPost(params: data)
            } else {
                if let idVal = UserDefaults.standard.object(forKey: "id") as? String {
                    if let dataVal = data["peers"] as? String {
                        data["peers"] = dataVal + idVal + ","
                    }
                }
                PeerManager.PeerManagerInstance.sendData(data : NSKeyedArchiver.archivedData(withRootObject: data))
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
        }
        task.resume()
    }

    @IBAction func setSafetySettings(_ sender: UISegmentedControl) {
        switch(sender.selectedSegmentIndex){
        case 0:
            UserDefaults.standard.set(0, forKey: "status")
            if let auth_Token = UserDefaults.standard.object(forKey: "token") as? String {
                if(auth_Token != ""){
                    if let id = UserDefaults.standard.object(forKey: "id") as? String {
                        if(id != ""){
                            var data = ["type" : "status", "peers" : "", "id" : id, "token" : auth_Token, "username" : UserDefaults.standard.object(forKey: "username"), "status": 0]
                            if(InternetManager.internetManager.isInternetAvailable()){
                                self.safetyPost(params: data)
                            } else {
                                if let idVal = UserDefaults.standard.object(forKey: "id") as? String {
                                    if let dataVal = data["peers"] as? String {
                                        data["peers"] = dataVal + idVal + ","
                                    }
                                }
                                PeerManager.PeerManagerInstance.sendData(data : NSKeyedArchiver.archivedData(withRootObject: data))
                            }
                        }
                    }
                }
            }
        case 1:
            UserDefaults.standard.set(1, forKey: "status")
            if let auth_Token = UserDefaults.standard.object(forKey: "token") as? String {
                if(auth_Token != ""){
                    if let id = UserDefaults.standard.object(forKey: "id") as? String {
                        if(id != ""){
                            var data = ["type" : "status", "peers" : "", "id" : id, "token" : auth_Token, "username" : UserDefaults.standard.object(forKey: "username"), "status": 1]
                            if(InternetManager.internetManager.isInternetAvailable()){
                                self.safetyPost(params: data)
                            } else {
                                if let idVal = UserDefaults.standard.object(forKey: "id") as? String {
                                    if let dataVal = data["peers"] as? String {
                                        data["peers"] = dataVal + idVal + ","
                                    }
                                }
                                PeerManager.PeerManagerInstance.sendData(data : NSKeyedArchiver.archivedData(withRootObject: data))
                            }
                        }
                    }
                }
            }
        default : break
        }
    }
    
    func safetyPost(params: [String:Any]) {
        var request = URLRequest(url: URL(string: "https://m3sh-louismc4.c9users.io/statusupdate")!)
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
            
            let jsonResponse = try? JSONSerialization.jsonObject(with: data, options: [])
            
            if let resp = (jsonResponse as! NSDictionary)["id"] as? String {
                if resp == UserDefaults.standard.object(forKey: "id") as? String {
                    if let respMsg = (jsonResponse as! NSDictionary)["msg"] as? String {
                        DispatchQueue.main.async() {
                            let alert = UIAlertController(title: "Alert", message: respMsg, preferredStyle: UIAlertControllerStyle.alert)
                            alert.addAction(UIAlertAction(title: "Okay", style: UIAlertActionStyle.default, handler: nil))
                            self.present(alert, animated: true, completion: nil)
                        }
                    }
                } else {
                    var data = ["id" : (jsonResponse as! NSDictionary)["id"] as? String, "msg" : (jsonResponse as! NSDictionary)["msg"] as? String, "peers" : "", "type" : "status"]
                    if let idVal = UserDefaults.standard.object(forKey: "id") as? String {
                        if let dataVal = data["peers"] as? String {
                            data["peers"] = dataVal + idVal + ","
                        }
                    }
                    PeerManager.PeerManagerInstance.sendData(data : NSKeyedArchiver.archivedData(withRootObject: data))
                }
            }
        }
        task.resume()
    }
    
    func showMsg(msg : String){
        DispatchQueue.main.async() {
            let alert = UIAlertController(title: "Alert", message: msg, preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "Okay", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        }
    }
}
