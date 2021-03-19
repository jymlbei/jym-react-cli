import Mock from 'mockjs'
import urls from '@src/config/urls.js'

Mock.mock(urls.product_all, [
  // 产品列表
  {'id': 1, 'title': 'iPad 4 Mini', 'price': 500.01, 'inventory': 2},
  {'id': 2, 'title': 'H&M T-Shirt White', 'price': 10.99, 'inventory': 10},
  {'id': 3, 'title': 'Charli XCX - Sucker CD', 'price': 19.99, 'inventory': 5}
])

Mock.mock(urls.add_product, {
  // 新增成功
  res: 0
})

export default Mock
