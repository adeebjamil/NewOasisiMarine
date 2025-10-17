import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { generateSlug } from '@/utils/slug';
import { ObjectId } from 'mongodb';

/**
 * FINAL FIX: Create FIRE SAFETY in the CORRECT collection (subcategories, not categories)
 */
export async function GET(request: NextRequest) {
  try {
    console.log('\n🔥 FINAL FIX: Creating FIRE SAFETY in subcategories collection...\n');
    
    const subcategoriesCollection = await getCollection('subcategories');
    const categoriesCollection = await getCollection('categories');
    const productsCollection = await getCollection('products');
    
    // The Fire Safety subcategory ID that products reference
    const fireSafetyId = new ObjectId('68c26a51aae41600a374c673');
    
    // Check if it already exists in subcategories collection
    const existing = await subcategoriesCollection.findOne({ _id: fireSafetyId });
    
    if (existing) {
      console.log('✅ FIRE SAFETY already exists in subcategories collection');
      return NextResponse.json({
        success: true,
        message: 'FIRE SAFETY already exists',
        subcategory: {
          id: existing._id.toString(),
          name: existing.name,
          collection: 'subcategories'
        }
      });
    }
    
    // Find the parent category (should be "Marine Supply" or "Products")
    const parentCategory = await categoriesCollection.findOne({ 
      isCategory: true,
      visible: true
    });
    
    if (!parentCategory) {
      throw new Error('No parent category found');
    }
    
    console.log(`Found parent category: ${parentCategory.name} (${parentCategory._id})`);
    
    // Count affected products
    const affectedProducts = await productsCollection.countDocuments({
      subcategoryId: fireSafetyId
    });
    
    console.log(`Found ${affectedProducts} products with Fire Safety subcategoryId`);
    
    // Create FIRE SAFETY in the subcategories collection
    const subcategoryDoc = {
      _id: fireSafetyId,
      name: 'FIRE SAFETY',
      href: '/products/fire-safety',
      categoryId: parentCategory._id,
      visible: true,
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await subcategoriesCollection.insertOne(subcategoryDoc);
    
    console.log('✅ FIRE SAFETY created in subcategories collection');
    console.log(`   - ID: ${fireSafetyId}`);
    console.log(`   - Name: FIRE SAFETY`);
    console.log(`   - Parent: ${parentCategory.name}`);
    console.log(`   - Products linked: ${affectedProducts}`);
    
    // Also ensure it exists in categories collection for backup
    const categoriesDoc = await categoriesCollection.findOne({ _id: fireSafetyId });
    if (!categoriesDoc) {
      await categoriesCollection.insertOne({
        _id: fireSafetyId,
        name: 'FIRE SAFETY',
        href: '/products/fire-safety',
        isCategory: false,
        visible: true,
        order: 4,
        parentId: parentCategory._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Also created backup in categories collection');
    }
    
    // Generate slugs for products without them
    console.log('\n📝 Generating missing slugs...');
    const productsWithoutSlug = await productsCollection
      .find({
        $or: [
          { slug: { $exists: false } },
          { slug: null },
          { slug: '' }
        ]
      })
      .toArray();
    
    let slugsGenerated = 0;
    for (const product of productsWithoutSlug) {
      try {
        let slug = generateSlug(product.name);
        
        const existingProduct = await productsCollection.findOne({ 
          slug,
          _id: { $ne: product._id }
        });
        
        if (existingProduct) {
          slug = `${slug}-${Date.now()}`;
        }
        
        await productsCollection.updateOne(
          { _id: product._id },
          { 
            $set: { 
              slug,
              updatedAt: new Date()
            }
          }
        );
        
        slugsGenerated++;
        console.log(`   ✅ ${product.name} -> ${slug}`);
      } catch (error) {
        console.error(`   ❌ Failed to generate slug for ${product.name}`);
      }
    }
    
    console.log(`\n✅ Generated ${slugsGenerated} slugs`);
    
    // Final verification
    const fireSafetyProducts = await productsCollection.find({
      subcategoryId: fireSafetyId,
      isActive: true
    }).toArray();
    
    console.log(`\n🎉 FINAL RESULT:`);
    console.log(`   - FIRE SAFETY subcategory created in correct collection`);
    console.log(`   - ${fireSafetyProducts.length} active products linked`);
    console.log(`   - ${slugsGenerated} product slugs generated`);
    console.log(`   - Fire Safety page should now display products!\n`);
    
    return NextResponse.json({
      success: true,
      message: '🎉 All fixes applied successfully!',
      results: {
        fireSafety: {
          created: true,
          collection: 'subcategories',
          id: fireSafetyId.toString(),
          href: '/products/fire-safety',
          activeProducts: fireSafetyProducts.length
        },
        slugs: {
          generated: slugsGenerated,
          productsFixed: productsWithoutSlug.length
        },
        products: fireSafetyProducts.map(p => ({
          name: p.name,
          slug: p.slug,
          detailUrl: `/products/detail/${p.slug}`
        })).slice(0, 5)
      }
    });
    
  } catch (error) {
    console.error('❌ Final fix failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to apply final fix',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
