import { Responsive } from "@/types";

export const customLeftArrow = (
    <div className="absolute arrow-btn left-0 text-center py-3 cursor-pointer bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:from-gray-700 hover:to-gray-800 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 text-white w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    </div>
);

export const customRightArrow = (
    <div className="absolute arrow-btn right-0 text-center py-3 cursor-pointer bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:from-gray-700 hover:to-gray-800 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 text-white w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    </div>
);

export const responsive: Record<string, Responsive> = {
  'superLargeDesktop': {
        breakpoint: { max: 4000, min: 1024 },
        width: '100%',
        height: '500px'
  },
  'desktop': {
        breakpoint: { max: 1024, min: 768 },
        width: '100%',
        height: '450px'
  },
  'tablet': {
        breakpoint: { max: 768, min: 640 },
        width: '100%',
        height: '400px'
  },
  'mobile': {
        breakpoint: { max: 640, min: 0 },
        width: '100%',
        height: '320px'
  }
};