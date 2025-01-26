'use client';

import { useEffect, useState } from 'react';

export function ClientOnlyDate({ date }: { date: string | number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevents hydration mismatch
  }

  return (
    <time dateTime={new Date(date).toISOString()}>
      {new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(date))}
    </time>
  );
}







// 'use client';

// import { useEffect, useState } from 'react';

// export function ClientOnlyDate({ date }: { date: string | number }) {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return <span>Loading...</span>;
//   }

//   return (
//     <span>
//       {new Intl.DateTimeFormat('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       }).format(new Date(date))}
//     </span>
//   );
// } 