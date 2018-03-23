//
//  MenuViewController.swift
//  WAWET
//
//  Created by sungnni on 2018. 3. 23..
//  Copyright © 2018년 SsungNni. All rights reserved.
//

import UIKit
import Alamofire

class MenuViewController: UIViewController {
    
    @IBOutlet private weak var categoryNameLabel: UILabel!
    @IBOutlet private weak var subCategoryNameLabel: UILabel!
    @IBOutlet private weak var menuLabel: UILabel!
    @IBOutlet private weak var menuImageView: UIImageView!
    var itme:Menu? = nil
    var itmelist:[Menu]? = nil
    let url = "http://192.168.0.16:3000"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        alamofireMenu()
        
        
    }
    
    
    func alamofireMenu() {
        let alamofire = Alamofire.request(self.url, method: .get, encoding: URLEncoding.httpBody)
        alamofire.responseData { response in
            switch response.result {
            case .success(let value):
                let result = try! JSONDecoder().decode([Menu].self, from: value)
                self.itmelist = result
                self.itme = self.randomPick(datalist: result)
                self.menuLabel.text = self.itme?.title

                Alamofire.request((self.itme?.image)!).responseData { (response) in
                    if response.error == nil {
                        print(response.result)
                        if let data = response.data {
                            self.menuImageView.image = UIImage(data: data)
                        }
                    }
                }
                    return
            case .failure(let error):
                print("ssssss")
                print(error)
            }
        }
    }
    
    
    @IBAction func sss(){
        let temp = randomPick(datalist: itmelist!)
        self.menuLabel.text = temp.title
        Alamofire.request((temp.image)!).responseData { (response) in
            if response.error == nil {
                print(response.result)
                if let data = response.data {
                    self.menuImageView.image = UIImage(data: data)
                }
            }
        }
    }
    
    
    func randomPick(datalist:[Menu]) -> Menu{
        
        let index:Int = Int(arc4random_uniform(UInt32(datalist.count)))
        
        return datalist[index]
    }
    

    class Menu: Decodable {
        
        enum CodingKeys: String, CodingKey {
            case title
            case image
            case url
        }
        
        let url: String?
        let title: String?
        var image: String?//ens image
        
        

    }
}
