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
    
    var subTitle: [String] = []
    
    @IBOutlet var categoryNameLabel: UILabel!
    @IBOutlet var subCategoryNameLabel: UILabel!
    @IBOutlet private weak var menuLabel: UILabel!
    @IBOutlet private weak var menuImageView: UIImageView!
    var itme:Menu? = nil
    var itmelist:[Menu]? = nil
    
    var url = "http://192.168.0.16:3000/category?p="
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        categoryNameLabel.text = subTitle[0]
        subCategoryNameLabel.text = subTitle[1]
        
        
        let temp = "여름"
        url+=temp
        
        self.url = url.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
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
                print(error)
            }
        }
    }
    
    
    @IBAction func refresh(){
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
        var image: String? //ens image
    }
}
