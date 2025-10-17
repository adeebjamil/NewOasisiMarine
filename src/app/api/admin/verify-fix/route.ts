import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const fireSafetyId = new ObjectId('68c26a51aae41600a374c673');
    const productsParentId = new ObjectId('68b0006dc17f5c9596ae9d3a');
    
    // 1. Check categories collection
    const categoriesCollection = await getCollection('categories');
    const categories = await categoriesCollection.find({}).toArray();
    
    // 2. Check subcategories collection
    const subcategoriesCollection = await getCollection('subcategories');
    const subcategories = await subcategoriesCollection.find({}).toArray();
    const fireSafety = await subcategoriesCollection.findOne({ _id: fireSafetyId });
    
    // 3. Check products
    const productsCollection = await getCollection('products');
    const fireProducts = await productsCollection.find({
      subcategoryId: fireSafetyId
    }).toArray();
    
    // 4. Test results
    const tests = {
      '✅ Only ONE category (Products)': categories.length === 1,
      '✅ Products category exists': categories[0]?.name === 'Products',
      '✅ 20 subcategories exist': subcategories.length === 20,
      '✅ FIRE SAFETY exists': !!fireSafety,
      '✅ FIRE SAFETY has correct href': fireSafety?.href === '/products/fire-safety',
      '✅ FIRE SAFETY has correct categoryId': fireSafety?.categoryId?.toString() === productsParentId.toString(),
      '✅ 12 Fire Safety products exist': fireProducts.length === 12,
      '✅ All Fire Safety products are active': fireProducts.every((p: any) => p.isActive === true),
      '✅ All products have slugs': fireProducts.every((p: any) => !!p.slug)
    };
    
    const allPassed = Object.values(tests).every(result => result === true);
    
    return NextResponse.json({
      success: allPassed,
      status: allPassed ? '🎉 ALL TESTS PASSED!' : '⚠️ Some tests failed',
      tests,
      details: {
        categories: {
          count: categories.length,
          list: categories.map((c: any) => ({
            id: c._id?.toString(),
            name: c.name,
            isCategory: c.isCategory
          }))
        },
        subcategories: {
          count: subcategories.length,
          fireSafety: fireSafety ? {
            id: fireSafety._id?.toString(),
            name: fireSafety.name,
            href: fireSafety.href,
            categoryId: fireSafety.categoryId?.toString(),
            visible: fireSafety.visible,
            order: fireSafety.order
          } : null
        },
        products: {
          total: fireProducts.length,
          active: fireProducts.filter((p: any) => p.isActive).length,
          withSlugs: fireProducts.filter((p: any) => p.slug).length
        }
      },
      deploymentReady: allPassed,
      nextSteps: allPassed ? [
        '1. Test Fire Safety page: http://localhost:3000/products/fire-safety',
        '2. Verify all 12 products are displaying',
        '3. Test other subcategory pages',
        '4. Run: git add .',
        '5. Run: git commit -m "Fixed category/subcategory structure"',
        '6. Run: git push',
        '7. Deploy to production'
      ] : [
        '1. Review failed tests above',
        '2. Fix remaining issues',
        '3. Re-run this endpoint'
      ]
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
