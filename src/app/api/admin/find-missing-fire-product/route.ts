import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const productsCollection = await getCollection('products');
    const fireSafetyId = new ObjectId('68c26a51aae41600a374c673');
    
    // Find ALL products with Fire Safety subcategoryId
    const allFireProducts = await productsCollection.find({
      subcategoryId: fireSafetyId
    }).toArray();
    
    console.log('🔥 Total Fire Safety products:', allFireProducts.length);
    
    // Separate active and inactive
    const activeProducts = allFireProducts.filter(p => p.isActive === true);
    const inactiveProducts = allFireProducts.filter(p => p.isActive !== true);
    
    console.log('✅ Active:', activeProducts.length);
    console.log('❌ Inactive:', inactiveProducts.length);
    
    return NextResponse.json({
      success: true,
      total: allFireProducts.length,
      active: activeProducts.length,
      inactive: inactiveProducts.length,
      activeProducts: activeProducts.map(p => ({
        id: p._id?.toString(),
        name: p.name,
        isActive: p.isActive,
        slug: p.slug
      })),
      inactiveProducts: inactiveProducts.map(p => ({
        id: p._id?.toString(),
        name: p.name,
        isActive: p.isActive,
        slug: p.slug
      }))
    });
  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
