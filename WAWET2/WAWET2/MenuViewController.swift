//
//  MenuViewController.swift
//  WAWET2
//
//  Created by sungnni on 2018. 3. 28..
//  Copyright © 2018년 SsungNni. All rights reserved.
//

import UIKit

class MenuViewController: UIViewController, UICollectionViewDelegateFlowLayout, UICollectionViewDataSource {

    @IBOutlet private weak var menuCollectionView: UICollectionView!
    @IBOutlet var testLabel: UILabel?
    
    var name: String {
        get {
            return self.testLabel!.text!
        }
        set {
            testLabel?.text = newValue
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.menuCollectionView.delegate = self
        self.menuCollectionView.dataSource = self
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return 6
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "menuCell", for: indexPath) as! MenuCollectionViewCell
        cell.menuName.text = "test"
        
        return cell
    }
}
