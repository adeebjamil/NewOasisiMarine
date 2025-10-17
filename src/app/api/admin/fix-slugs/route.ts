import { NextRequest, NextResponse } from 'next/server';
import { ProductModel } from '@/models/Product';
import { generateSlug } from '@/utils/slug';
import { cookies } from 'next/headers';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

/**
 * Fix all products with null or missing slugs
 * This is a one-time migration endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    console.log('Starting slug migration...');

    // Get all products
    const allProducts = await ProductModel.findMany({});
    console.log(`Found ${allProducts.length} total products`);

    const productsWithoutSlug = allProducts.filter(p => !p.slug);
    console.log(`Found ${productsWithoutSlug.length} products without slugs`);

    const updatedProducts: string[] = [];
    const errors: any[] = [];

    // Update each product without a slug
    for (const product of productsWithoutSlug) {
      try {
        if (!product._id || !product.name) {
          console.log(`Skipping product without ID or name:`, product);
          continue;
        }

        // Generate slug from product name
        let slug = generateSlug(product.name);
        
        // Check if slug already exists
        const existingProduct = await ProductModel.findBySlug(slug);
        if (existingProduct && existingProduct._id?.toString() !== product._id.toString()) {
          // Make it unique with timestamp
          slug = `${slug}-${Date.now()}`;
        }

        // Update the product with the new slug
        await ProductModel.updateById(product._id.toString(), { slug });
        
        updatedProducts.push(product.name);
        console.log(`✅ Updated product: ${product.name} -> ${slug}`);
      } catch (error) {
        console.error(`❌ Error updating product ${product.name}:`, error);
        errors.push({
          productName: product.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Slug migration completed',
      stats: {
        totalProducts: allProducts.length,
        productsWithoutSlug: productsWithoutSlug.length,
        updated: updatedProducts.length,
        errors: errors.length
      },
      updatedProducts,
      errors
    });
  } catch (error) {
    console.error('Error in slug migration:', error);
    return NextResponse.json(
      { 
        error: 'Failed to migrate slugs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
