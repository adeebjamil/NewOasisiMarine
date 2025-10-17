import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const categoriesCollection = await getCollection('categories');
    const productsParentId = new ObjectId('68b0006dc17f5c9596ae9d3a');
    
    // 1. Find all items in categories collection that are NOT the Products parent
    const allCategories = await categoriesCollection.find({}).toArray();
    console.log('📦 Total items in categories collection:', allCategories.length);
    
    // 2. Separate parent category from individual items
    const parentCategory = allCategories.find((cat: any) => 
      cat._id?.toString() === productsParentId.toString()
    );
    
    const duplicateItems = allCategories.filter((cat: any) => 
      cat._id?.toString() !== productsParentId.toString()
    );
    
    console.log('✅ Parent category:', parentCategory?.name);
    console.log('❌ Duplicate items to delete:', duplicateItems.length);
    
    // 3. Delete all duplicate items (keep only Products parent)
    if (duplicateItems.length > 0) {
      const duplicateIds = duplicateItems.map((item: any) => item._id);
      const deleteResult = await categoriesCollection.deleteMany({
        _id: { $in: duplicateIds }
      });
      
      console.log('🗑️ Deleted', deleteResult.deletedCount, 'duplicate items');
    }
    
    // 4. Verify cleanup
    const remainingCategories = await categoriesCollection.find({}).toArray();
    
    return NextResponse.json({
      success: true,
      message: 'Categories collection cleaned up successfully',
      details: {
        before: {
          total: allCategories.length,
          duplicates: duplicateItems.length
        },
        deleted: duplicateItems.map((item: any) => ({
          id: item._id?.toString(),
          name: item.name,
          href: item.href
        })),
        after: {
          total: remainingCategories.length,
          remaining: remainingCategories.map((cat: any) => ({
            id: cat._id?.toString(),
            name: cat.name,
            isCategory: cat.isCategory
          }))
        },
        nextSteps: [
          '1. Refresh your admin panel',
          '2. Only "Products" category should appear',
          '3. All 20 items should be under Products as subcategories',
          '4. Go to Fire Safety page and refresh'
        ]
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
