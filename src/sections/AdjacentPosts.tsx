import React, { useState, useEffect } from 'react';

//import { getAdjacentPosts } from '@/services';
import { AdjacentPost } from '@/types';
import { AdjacentPostCard } from '@/components';

const AdjacentPosts = ({ createdAt, id }: {createdAt: number, id: string}) => {
  const [adjacentPost, setAdjacentPost] = useState<AdjacentPost | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    /*getAdjacentPosts(createdAt, id).then((result) => {
      setAdjacentPost(result);
      setDataLoaded(true);
    });*/
  }, [id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-12 mb-8">
      {dataLoaded && adjacentPost &&(
        <>
          {adjacentPost.previous && (
            <div className={`${adjacentPost.next ? 'col-span-1 lg:col-span-4' : 'col-span-1 lg:col-span-8'} adjacent-post rounded-lg relative h-72`}>
              <AdjacentPostCard post={adjacentPost.previous} position="LEFT" />
            </div>
          )}
          {adjacentPost.next && (
            <div className={`${adjacentPost.previous ? 'col-span-1 lg:col-span-4' : 'col-span-1 lg:col-span-8'} adjacent-post rounded-lg relative h-72`}>
              <AdjacentPostCard post={adjacentPost.next} position="RIGHT" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdjacentPosts;
