//
//  MainTableViewCell.swift
//  WAWET
//
//  Created by sungnni on 2018. 3. 23..
//  Copyright © 2018년 SsungNni. All rights reserved.
//

import UIKit

class MainTableViewCell: UITableViewCell, UICollectionViewDelegate, UICollectionViewDataSource {
    
    @IBOutlet private weak var collectionView: UICollectionView!
    
    @IBOutlet var categoryImage: UIImageView!
    @IBOutlet var categoryButton: UIButton!
    var item: categoryItem?{
        didSet{
            categoryButton.setTitle(item?.title, for: .normal)
//            print(item?.subTitle)
//            dump(item)
        }
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        collectionView.delegate = self
        collectionView.dataSource = self
    }

    
//    override func setSelected(_ selected: Bool, animated: Bool) {
//        super.setSelected(selected, animated: animated)
//    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        print(section)
        return (item?.subTitle!.count)!
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let collectionCell = collectionView.dequeueReusableCell(withReuseIdentifier: "collectionCell", for: indexPath) as! MainCollectionViewCell
        collectionCell.collectionButton.setTitle(item?.subTitle[indexPath.row] , for: .normal)
        return collectionCell
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        <#code#>
    }
}
