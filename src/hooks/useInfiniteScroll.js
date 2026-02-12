import { useEffect, useRef, useCallback } from "react";


export const useInfiniteScroll = (
  callback,
  hasMore,
  loading,
  threshold = 200,
) => {
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, callback],
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (
        scrollHeight - scrollTop - clientHeight < threshold &&
        hasMore &&
        !loading
      ) {
        callback();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback, hasMore, loading, threshold]);

  return lastElementRef;
};

export default useInfiniteScroll;
