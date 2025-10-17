import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { generateSlug } from '@/utils/slug';
import { ObjectId } from 'mongodb';

/**
 * Complete fix for all product display issues
 * No authentication required - direct fix
 */
export async function GET(request: NextRequest) {
  try {
    const results = {
      step1_fireSafety: null as any,
      step2_slugs: null as any,
      step3_verification: null as any,
      success: false,
      message: ''
    };

    // STEP 1: Fix FIRE SAFETY subcategory
    console.log('\n🔥 Step 1: Creating FIRE SAFETY subcategory...');
    try {
      const categoriesCollection = await getCollection('categories');
      const productsCollection = await getCollection('products');
      
      const fireSafetyId = new ObjectId('68c26a51aae41600a374c673');
      const existing = await categoriesCollection.findOne({ _id: fireSafetyId });
      
      if (!existing) {
        const parentCategory = await categoriesCollection.findOne({ 
          name: 'Products',
          isCategory: true 
        });

        if (parentCategory) {
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
          
          const affectedProducts = await productsCollection.countDocuments({
            subcategoryId: fireSafetyId
          });
          
          results.step1_fireSafety = {
            success: true,
            message: 'FIRE SAFETY subcategory created',
            affectedProducts
          };
          console.log(`✅ Created FIRE SAFETY subcategory - ${affectedProducts} products linked`);
        } else {
          throw new Error('Parent category not found');
        }
      } else {
        results.step1_fireSafety = {
          success: true,
          message: 'FIRE SAFETY already exists',
          alreadyExisted: true
        };
        console.log('✅ FIRE SAFETY already exists');
      }
    } catch (error) {
      results.step1_fireSafety = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.error('❌ Step 1 failed:', error);
    }

    // STEP 2: Generate missing slugs
    console.log('\n📝 Step 2: Generating missing slugs...');
    try {
      const productsCollection = await getCollection('products');
      const productsWithoutSlug = await productsCollection
        .find({
          $or: [
            { slug: { $exists: false } },
            { slug: null },
            { slug: '' }
          ]
        })
        .toArray();

      let updated = 0;
      const errors: any[] = [];

      for (const product of productsWithoutSlug) {
        try {
          let slug = generateSlug(product.name);
          
          // Check for duplicates
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

          updated++;
          console.log(`✅ Generated slug for: ${product.name} -> ${slug}`);
        } catch (error) {
          errors.push({
            productId: product._id?.toString(),
            productName: product.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      results.step2_slugs = {
        success: true,
        totalProducts: productsWithoutSlug.length,
        updated,
        errors: errors.length > 0 ? errors : undefined
      };
      console.log(`✅ Generated ${updated} slugs`);
    } catch (error) {
      results.step2_slugs = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.error('❌ Step 2 failed:', error);
    }

    // STEP 3: Verification
    console.log('\n🔍 Step 3: Verifying fixes...');
    try {
      const productsCollection = await getCollection('products');
      const categoriesCollection = await getCollection('categories');
      
      const allProducts = await productsCollection.find({}).toArray();
      const productsWithSlug = allProducts.filter(p => p.slug);
      const subcategories = await categoriesCollection.find({ isCategory: false }).toArray();
      
      const fireSafetyExists = await categoriesCollection.findOne({ 
        _id: new ObjectId('68c26a51aae41600a374c673')
      });
      
      const fireSafetyProducts = await productsCollection.countDocuments({
        subcategoryId: new ObjectId('68c26a51aae41600a374c673'),
        isActive: true
      });

      results.step3_verification = {
        success: true,
        totalProducts: allProducts.length,
        productsWithSlugs: productsWithSlug.length,
        productsMissingSlugs: allProducts.length - productsWithSlug.length,
        totalSubcategories: subcategories.length,
        fireSafetyExists: !!fireSafetyExists,
        fireSafetyProductCount: fireSafetyProducts
      };
      
      console.log('✅ Verification complete:');
      console.log(`   - Products with slugs: ${productsWithSlug.length}/${allProducts.length}`);
      console.log(`   - Subcategories: ${subcategories.length}`);
      console.log(`   - FIRE SAFETY exists: ${!!fireSafetyExists}`);
      console.log(`   - FIRE SAFETY products: ${fireSafetyProducts}`);
    } catch (error) {
      results.step3_verification = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.error('❌ Step 3 failed:', error);
    }

    // Final result
    const allStepsSuccessful = 
      results.step1_fireSafety?.success &&
      results.step2_slugs?.success &&
      results.step3_verification?.success;

    results.success = allStepsSuccessful;
    results.message = allStepsSuccessful 
      ? '🎉 All fixes completed successfully!' 
      : '⚠️ Some fixes completed with issues';

    console.log(`\n${results.message}\n`);

    return NextResponse.json(results, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('❌ Complete fix failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to complete fixes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
