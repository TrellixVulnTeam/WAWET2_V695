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
            categoryImage.image = UIImage(named: (item?.img)!)
        }
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        collectionView.delegate = self
        collectionView.dataSource = self
    }

    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return (item?.subTitle!.count)!
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let collectionCell = collectionView.dequeueReusableCell(withReuseIdentifier: "collectionCell", for: indexPath) as! MainCollectionViewCell
        collectionCell.collectionButton.setTitle(item?.subTitle[indexPath.row] , for: .normal)
        return collectionCell
    }
}
