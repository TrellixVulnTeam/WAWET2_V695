//
//  ViewController.swift
//  WAWET2
//
//  Created by sungnni on 2018. 3. 28..
//  Copyright © 2018년 SsungNni. All rights reserved.
//

import UIKit
import Alamofire

class ViewController: UIViewController, UICollectionViewDelegateFlowLayout, UICollectionViewDataSource, UIScrollViewDelegate {
    
    // 브런치 테스트
    // ㅁㄴㅇㄹㅁㅇ
    
    @IBOutlet private weak var categoryCollection: UICollectionView!
    @IBOutlet private weak var menuListScroll: UIScrollView!
    
    var url = "http://172.30.1.49:3000/"
    
    var scrollview: CGRect?
    var categoryList: [Category] = []
    

    override func viewDidLoad() {
        super.viewDidLoad()

        categoryCollection.delegate = self
        categoryCollection.dataSource = self
        
        self.menuListScroll.delegate = self

//        self.categoryCollection.showsHorizontalScrollIndicator = false
        self.menuListScroll.decelerationRate = UIScrollViewDecelerationRateFast
    }

    
    override func viewDidAppear(_ animated: Bool) {
        
        categryDataLoad()
        
        // 페이지 단위로 스크롤
        self.menuListScroll.isPagingEnabled = true
        
        // 스크롤 전체 사이즈
        self.menuListScroll.contentSize = CGSize(
            width: self.menuListScroll.bounds.width * CGFloat(categoryList.count),
            height: self.menuListScroll.bounds.height)
        
        // menuListScroll에 MenuViewController 넣기
        for (idx, content) in (self.categoryList.enumerated()) {
            
            let menuVC = self.storyboard?.instantiateViewController(withIdentifier: "MenuViewController") as! MenuViewController
            menuVC.view.frame = CGRect(x: 0,
                                       y: 0,
                                       width: self.menuListScroll.bounds.width,
                                       height: self.menuListScroll.bounds.height)
            
            menuVC.testLabel?.text = content.title
            menuVC.view.frame.origin = CGPoint(x: self.menuListScroll.bounds.width * CGFloat(idx), y: 0)
            
            self.addChildViewController(menuVC)
            self.menuListScroll.addSubview(menuVC.view)
            
            menuVC.willMove(toParentViewController: self)
        }
    }
    
    func categryDataLoad() {
        Alamofire.request(url, method: .get)
        .validate()
            .responseData { (response) in
                switch response.result {
                case .success(let value):
                    print(value)
                    let categoryInfo = try! JSONDecoder().decode([Category].self, from: value)
                    self.categoryList = categoryInfo
                    
                    self.categoryCollection.reloadData()
                    
                case .failure(let error):
                    print(error.localizedDescription)
                }
        }
    }
    
    
    
    
    
    /***************************************************
     <Delegate>
     -. CollectionView
     -. ScrollView
     ***************************************************/
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return categoryList.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "cell", for: indexPath) as! CategoryCollectionViewCell
        cell.categoryName.text = categoryList[indexPath.row].title
        
        return cell
    }
    
    // 카테고리 리스트 눌렀을 때, 메뉴 스크롤 뷰도 같이 움직이도록
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        
        let pointX = menuListScroll.frame.size.width * CGFloat(indexPath.row)
        menuListScroll.setContentOffset(CGPoint(x: pointX, y: 0), animated: true)
    }
    
    
    
    // 메뉴 스크롤 뷰 감속이 끝났을 때(멈췄을 때)
    func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        
//        print(scrollView.contentOffset)
        let position = scrollView.contentOffset.x / scrollView.frame.width
//        print(position)
        let indexPath = IndexPath(item: Int(position), section: 0)
        categoryCollection.scrollToItem(at: indexPath, at: .left, animated: true)
    }
    
}

