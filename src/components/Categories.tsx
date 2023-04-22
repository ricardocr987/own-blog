import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';

const categories: Category[] = [
  {     
    id: '1',
    name: 'Blockchain'
  },
  {     
    id: '2',
    name: 'Aleph',
  },
]
const Categories = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Categories</h3>
      {categories.map((category, index) => (
        <Link key={index} href={`/category/${category.id}`}>
          <span className={`cursor-pointer block ${(index === categories.length - 1) ? 'border-b-0' : 'border-b'} pb-3 mb-3`}>{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Categories;

