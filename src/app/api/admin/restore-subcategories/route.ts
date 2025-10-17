import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

/**
 * Restore missing subcategories based on product data
 * This will recreate the 20 missing subcategories
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

    const categoriesCollection = await getCollection('categories');
    
    // Get the parent "Products" category
    const parentCategory = await categoriesCollection.findOne({ 
      name: 'Products',
      isCategory: true 
    });

    if (!parentCategory) {
      return NextResponse.json(
        { error: 'Parent category "Products" not found' },
        { status: 404 }
      );
    }

    // Define all 20 missing subcategories with their correct IDs and names
    const subcategoriesToRestore = [
      { 
        _id: new ObjectId('68c114c89004de5001f3c336'),
        name: 'PIPE FITTINGS',
        productCount: 15 
      },
      { 
        _id: new ObjectId('68c115649004de5001f3c337'),
        name: 'RUBBER SHEETS',
        productCount: 6 
      },
      { 
        _id: new ObjectId('68c115a39004de5001f3c338'),
        name: 'EXPANSION JOINTS',
        productCount: 4 
      },
      { 
        _id: new ObjectId('68c26a51aae41600a374c674'),
        name: 'FIRE SAFETY',
        productCount: 12 
      },
      { 
        _id: new ObjectId('68c115c89004de5001f3c339'),
        name: 'FLANGES',
        productCount: 8 
      },
      { 
        _id: new ObjectId('68c116469004de5001f3c33a'),
        name: 'GI FITTINGS',
        productCount: 16 
      },
      { 
        _id: new ObjectId('68c116809004de5001f3c33b'),
        name: 'GROOVED FITTINGS',
        productCount: 7 
      },
      { 
        _id: new ObjectId('68c116cc9004de5001f3c33c'),
        name: 'SOCKET WELD FITTINGS',
        productCount: 13 
      },
      { 
        _id: new ObjectId('68c117189004de5001f3c33d'),
        name: 'HOSE COUPLINGS',
        productCount: 9 
      },
      { 
        _id: new ObjectId('68c117449004de5001f3c33e'),
        name: 'INDUSTRIAL HOSES',
        productCount: 9 
      },
      { 
        _id: new ObjectId('68c1176c9004de5001f3c33f'),
        name: 'CAMLOCK FITTINGS',
        productCount: 3 
      },
      { 
        _id: new ObjectId('68c117959004de5001f3c340'),
        name: 'MARINE EQUIPMENT',
        productCount: 10 
      },
      { 
        _id: new ObjectId('68c117b49004de5001f3c341'),
        name: 'CLAMPS & SHACKLES',
        productCount: 16 
      },
      { 
        _id: new ObjectId('68c118149004de5001f3c342'),
        name: 'FASTENERS',
        productCount: 17 
      },
      { 
        _id: new ObjectId('68c1184a9004de5001f3c343'),
        name: 'GASKETS',
        productCount: 10 
      },
      { 
        _id: new ObjectId('68c1188d9004de5001f3c344'),
        name: 'SHEETS & MATERIALS',
        productCount: 14 
      },
      { 
        _id: new ObjectId('68c118b59004de5001f3c345'),
        name: 'VALVES',
        productCount: 24 
      },
      { 
        _id: new ObjectId('68c26ae7aae41600a374c674'),
        name: 'GENERAL SUPPLIES',
        productCount: 17 
      },
      { 
        _id: new ObjectId('68c119259004de5001f3c346'),
        name: 'NIPPLES',
        productCount: 10 
      },
      { 
        _id: new ObjectId('68c119609004de5001f3c347'),
        name: 'SAFETY EQUIPMENT',
        productCount: 19 
      }
    ];

    const restored = [];
    const errors = [];
    let order = 1;

    for (const subcategory of subcategoriesToRestore) {
      try {
        // Check if it already exists
        const existing = await categoriesCollection.findOne({ _id: subcategory._id });
        
        if (existing) {
          console.log(`⏭️  Subcategory "${subcategory.name}" already exists, skipping`);
          continue;
        }

        // Create the subcategory document
        const subcategoryDoc = {
          _id: subcategory._id,
          name: subcategory.name,
          href: `/products/${subcategory.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`,
          isCategory: false, // This is a subcategory, not a parent category
          visible: true,
          order: order++,
          parentId: parentCategory._id,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await categoriesCollection.insertOne(subcategoryDoc);
        
        restored.push({
          id: subcategory._id.toString(),
          name: subcategory.name,
          productCount: subcategory.productCount
        });
        
        console.log(`✅ Restored: ${subcategory.name} (${subcategory.productCount} products)`);
      } catch (error) {
        console.error(`❌ Error restoring ${subcategory.name}:`, error);
        errors.push({
          name: subcategory.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Restored ${restored.length} subcategories`,
      restored,
      errors,
      totalProducts: 242,
      totalSubcategories: 20
    });
  } catch (error) {
    console.error('Error restoring subcategories:', error);
    return NextResponse.json(
      { 
        error: 'Failed to restore subcategories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
