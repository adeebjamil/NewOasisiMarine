import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const fireSafetyId = new ObjectId('68c26a51aae41600a374c673');
    
    // 1. Check subcategories collection
    const subcategoriesCollection = await getCollection('subcategories');
    const subcategory = await subcategoriesCollection.findOne({ _id: fireSafetyId });
    
    // 2. Check categories collection for navbar
    const categoriesCollection = await getCollection('categories');
    const allCategories = await categoriesCollection.find({}).toArray();
    
    // 3. Check products
    const productsCollection = await getCollection('products');
    const fireProducts = await productsCollection.find({
      subcategoryId: fireSafetyId
    }).toArray();
    
    // 4. Simulate what navbar API returns
    const parentCategory = allCategories.find((cat: any) => 
      cat.name === "Products" && cat.isCategory === true
    );
    
    console.log('🔍 DEBUG FIRE SAFETY:');
    console.log('1. Subcategory exists:', !!subcategory);
    console.log('2. Subcategory data:', subcategory);
    console.log('3. Parent category:', parentCategory);
    console.log('4. Total products:', fireProducts.length);
    console.log('5. Active products:', fireProducts.filter((p: any) => p.isActive === true).length);
    
    return NextResponse.json({
      success: true,
      subcategory: subcategory ? {
        id: subcategory._id?.toString(),
        name: subcategory.name,
        href: subcategory.href,
        categoryId: subcategory.categoryId?.toString(),
        visible: subcategory.visible,
        order: subcategory.order
      } : null,
      parentCategory: parentCategory ? {
        id: parentCategory._id?.toString(),
        name: parentCategory.name,
        href: parentCategory.href
      } : null,
      products: {
        total: fireProducts.length,
        active: fireProducts.filter((p: any) => p.isActive === true).length,
        list: fireProducts.map((p: any) => ({
          id: p._id?.toString(),
          name: p.name,
          isActive: p.isActive,
          slug: p.slug
        }))
      },
      issue: subcategory && subcategory.categoryId 
        ? subcategory.categoryId.toString() === parentCategory?._id?.toString()
          ? null
          : 'FIRE SAFETY categoryId does not match Products category!'
        : 'FIRE SAFETY missing categoryId!'
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
