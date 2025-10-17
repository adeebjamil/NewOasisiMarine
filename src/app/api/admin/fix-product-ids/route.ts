import { NextRequest, NextResponse } from 'next/server';
import { getCollection, toObjectId, ObjectId } from '@/lib/db';
import { cookies } from 'next/headers';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

/**
 * Fix all products to ensure categoryId and subcategoryId are proper ObjectIds
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

    console.log('Starting product IDs migration...');

    const productsCollection = await getCollection('products');
    const allProducts = await productsCollection.find({}).toArray();

    console.log(`Found ${allProducts.length} total products`);

    const fixed: string[] = [];
    const errors: any[] = [];
    let skipped = 0;

    for (const product of allProducts) {
      try {
        const updates: any = {};
        let needsUpdate = false;

        // Check categoryId
        if (product.categoryId) {
          // If it's a string, convert to ObjectId
          if (typeof product.categoryId === 'string') {
            try {
              updates.categoryId = new ObjectId(product.categoryId);
              needsUpdate = true;
              console.log(`Converting categoryId for "${product.name}": ${product.categoryId} (string) -> ObjectId`);
            } catch (e) {
              console.error(`Invalid categoryId for "${product.name}": ${product.categoryId}`);
              updates.categoryId = null;
              needsUpdate = true;
            }
          }
          // If it's not an ObjectId instance, try to convert it
          else if (!(product.categoryId instanceof ObjectId)) {
            try {
              updates.categoryId = new ObjectId(product.categoryId.toString());
              needsUpdate = true;
            } catch (e) {
              updates.categoryId = null;
              needsUpdate = true;
            }
          }
        }

        // Check subcategoryId
        if (product.subcategoryId) {
          // If it's a string, convert to ObjectId
          if (typeof product.subcategoryId === 'string') {
            try {
              updates.subcategoryId = new ObjectId(product.subcategoryId);
              needsUpdate = true;
              console.log(`Converting subcategoryId for "${product.name}": ${product.subcategoryId} (string) -> ObjectId`);
            } catch (e) {
              console.error(`Invalid subcategoryId for "${product.name}": ${product.subcategoryId}`);
              updates.subcategoryId = null;
              needsUpdate = true;
            }
          }
          // If it's not an ObjectId instance, try to convert it
          else if (!(product.subcategoryId instanceof ObjectId)) {
            try {
              updates.subcategoryId = new ObjectId(product.subcategoryId.toString());
              needsUpdate = true;
            } catch (e) {
              updates.subcategoryId = null;
              needsUpdate = true;
            }
          }
        }

        if (needsUpdate) {
          await productsCollection.updateOne(
            { _id: product._id },
            { 
              $set: { 
                ...updates,
                updatedAt: new Date()
              }
            }
          );

          fixed.push(product.name);
          console.log(`✅ Fixed product: ${product.name}`);
        } else {
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Error fixing product ${product.name}:`, error);
        errors.push({
          productName: product.name,
          productId: product._id.toString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product IDs migration completed',
      stats: {
        totalProducts: allProducts.length,
        fixed: fixed.length,
        skipped,
        errors: errors.length
      },
      fixedProducts: fixed,
      errors
    });
  } catch (error) {
    console.error('Error in product IDs migration:', error);
    return NextResponse.json(
      { 
        error: 'Failed to migrate product IDs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
