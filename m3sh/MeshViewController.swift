//
//  MeshViewController.swift
//  m3sh
//
//  Created by Louis Moc on 2017-09-16.
//  Copyright © 2017 Louis Moc. All rights reserved.
//

import UIKit
import MultipeerConnectivity

let MeshControllerInstance = MeshViewController()

class MeshViewController : UIViewController, MCBrowserViewControllerDelegate {
    //MeshDelegate
    
    var data : NSMutableArray = []
    
    class var meshInstance : MeshViewController {
        return MeshControllerInstance
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        PeerManager.PeerManagerInstance.setupPeer()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
        
    @IBAction func browse(_ sender: Any) {
        var browserViewController = MCBrowserViewController(serviceType: "Mesh", session: (PeerManager.PeerManagerInstance.peer?.session)!)
            
        browserViewController.delegate = self
            
        present(browserViewController, animated: true) {
            print("Presented Browser")
        }
    }
    
    @IBAction func startAdvertising(_ sender: Any) {
        PeerManager.PeerManagerInstance.start()
    }
        
    @IBAction func stopAdvertising(_ sender: Any) {
        PeerManager.PeerManagerInstance.stop()
    }
        
    // MCBrowserViewController Delegate
    func browserViewControllerWasCancelled(_ browserViewController: MCBrowserViewController!){
        browserViewController.dismiss(animated: true) {
            print("Browser Dismissed")
        }
    }
        
    func browserViewControllerDidFinish(_ browserViewController: MCBrowserViewController!){
        browserViewController.dismiss(animated: true,completion: {
            print("Browser Finished")
//            PeerManager.PeerManagerInstance.sendData()
        })
    }
}

