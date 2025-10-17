import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { cookies } from 'next/headers';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

/**
 * List all categories to see the structure
 */
export async function GET(request: NextRequest) {
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
    
    // Get ALL categories (both parent and children)
    const allCategories = await categoriesCollection.find({}).toArray();

    console.log('\n📋 === ALL CATEGORIES ===');
    console.log(`Total documents: ${allCategories.length}\n`);
    
    const categoryList = allCategories.map(cat => ({
      id: cat._id.toString(),
      name: cat.name,
      href: cat.href,
      isCategory: cat.isCategory,
      visible: cat.visible,
      order: cat.order,
      categoryId: cat.categoryId?.toString(),
    }));

    console.log('Categories (parent):');
    const parents = categoryList.filter(c => c.isCategory);
    parents.forEach((cat, i) => {
      console.log(`${i + 1}. "${cat.name}" (ID: ${cat.id})`);
    });

    console.log('\nSubcategories (children):');
    const children = categoryList.filter(c => !c.isCategory);
    children.forEach((cat, i) => {
      console.log(`${i + 1}. "${cat.name}" (ID: ${cat.id}, Parent: ${cat.categoryId})`);
    });

    // Check for Fire Safety
    const fireSafety = allCategories.filter(cat => 
      cat.name.toLowerCase().includes('fire') && 
      cat.name.toLowerCase().includes('safety')
    );

    console.log('\n🔥 Fire Safety found:', fireSafety.length);
    if (fireSafety.length > 0) {
      fireSafety.forEach(cat => {
        console.log(`   - "${cat.name}"`);
        console.log(`     ID: ${cat._id.toString()}`);
        console.log(`     isCategory: ${cat.isCategory}`);
        console.log(`     href: ${cat.href}`);
      });
    }

    return NextResponse.json({
      success: true,
      total: allCategories.length,
      categories: categoryList.filter(c => c.isCategory),
      subcategories: categoryList.filter(c => !c.isCategory),
      fireSafety: fireSafety.map(cat => ({
        id: cat._id.toString(),
        name: cat.name,
        isCategory: cat.isCategory,
        href: cat.href,
        categoryId: cat.categoryId?.toString(),
      })),
    });
  } catch (error) {
    console.error('Error listing categories:', error);
    return NextResponse.json(
      { 
        error: 'Failed to list categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
