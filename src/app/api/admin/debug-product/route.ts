import { NextRequest, NextResponse } from 'next/server';
import { ProductModel } from '@/models/Product';
import { getCollection } from '@/lib/db';
import { cookies } from 'next/headers';

// Check admin authentication
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('adminSession');
  return adminSession?.value === 'true';
}

/**
 * Debug endpoint to check and fix product category/subcategory associations
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

    const { searchParams } = new URL(request.url);
    const productName = searchParams.get('name');

    if (!productName) {
      return NextResponse.json(
        { error: 'Product name parameter is required' },
        { status: 400 }
      );
    }

    // Get the product
    const products = await ProductModel.findMany({});
    const product = products.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase())
    );

    if (!product) {
      return NextResponse.json(
        { error: `Product "${productName}" not found` },
        { status: 404 }
      );
    }

    // Get all categories and subcategories
    const categoriesCollection = await getCollection('categories');
    const allCategories = await categoriesCollection.find({}).toArray();

    // Find the category and subcategory
    let foundCategory = null;
    let foundSubcategory = null;

    for (const cat of allCategories) {
      if (cat.isCategory && product.categoryId) {
        if (cat._id.toString() === product.categoryId.toString()) {
          foundCategory = cat;
        }
      }
      
      if (!cat.isCategory && product.subcategoryId) {
        if (cat._id.toString() === product.subcategoryId.toString()) {
          foundSubcategory = cat;
        }
      }
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product._id?.toString(),
        name: product.name,
        slug: product.slug || null,
        isActive: product.isActive,
        categoryId: product.categoryId?.toString() || null,
        subcategoryId: product.subcategoryId?.toString() || null,
        createdAt: product.createdAt,
      },
      category: foundCategory ? {
        id: foundCategory._id.toString(),
        name: foundCategory.name,
        href: foundCategory.href,
      } : null,
      subcategory: foundSubcategory ? {
        id: foundSubcategory._id.toString(),
        name: foundSubcategory.name,
        href: foundSubcategory.href,
        categoryId: foundSubcategory.categoryId?.toString(),
      } : null,
      allSubcategories: allCategories
        .filter(cat => !cat.isCategory)
        .map(sub => ({
          id: sub._id.toString(),
          name: sub.name,
          href: sub.href,
          categoryId: sub.categoryId?.toString(),
        })),
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to debug product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Fix a product's category/subcategory assignment
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

    const body = await request.json();
    const { productId, subcategoryName } = body;

    if (!productId || !subcategoryName) {
      return NextResponse.json(
        { error: 'productId and subcategoryName are required' },
        { status: 400 }
      );
    }

    // Get all categories to find the subcategory
    const categoriesCollection = await getCollection('categories');
    const subcategory = await categoriesCollection.findOne({
      name: subcategoryName,
      isCategory: false,
    });

    if (!subcategory) {
      return NextResponse.json(
        { error: `Subcategory "${subcategoryName}" not found` },
        { status: 404 }
      );
    }

    // Update the product
    const updatedProduct = await ProductModel.updateById(productId, {
      categoryId: subcategory.categoryId,
      subcategoryId: subcategory._id,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product updated successfully. Assigned to "${subcategoryName}"`,
      product: {
        id: updatedProduct._id?.toString(),
        name: updatedProduct.name,
        categoryId: updatedProduct.categoryId?.toString(),
        subcategoryId: updatedProduct.subcategoryId?.toString(),
      },
      subcategory: {
        id: subcategory._id.toString(),
        name: subcategory.name,
        categoryId: subcategory.categoryId?.toString(),
      },
    });
  } catch (error) {
    console.error('Error fixing product:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fix product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
