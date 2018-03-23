//
//  MainViewController.swift
//  WAWET
//
//  Created by sungnni on 2018. 3. 23..
//  Copyright © 2018년 SsungNni. All rights reserved.
//

import UIKit

class MainViewController: UIViewController
{
    var index: Int = 0
    
    var list: [categoryItem] = []
    @IBOutlet private weak var tableView: UITableView!
    
    override func viewDidLoad() {
        tableView.delegate = self
        tableView.dataSource = self
        
        list.append(categoryItem(title: "제철메뉴", subTitle: ["봄", "여름", "가을", "겨울"]))
        list.append(categoryItem(title: "다이어트, 건강", subTitle: ["저칼로리", "디톡스","피로회복"]))
        list.append(categoryItem(title: "아이를 위한", subTitle: ["간식", "성장발달"]))
        list.append(categoryItem(title: "테마", subTitle: ["자취생", "요리초보", "글로벌"]))
    }
}

extension MainViewController: UITableViewDataSource, UITableViewDelegate {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return list.count // 4
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! MainTableViewCell
        cell.item = list[indexPath.row]
        dump(list[indexPath.row])
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 378
    }

}
