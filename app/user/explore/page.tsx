"use client"
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import GridPostList from "@/components/GridPostList";
import UserCard from "@/components/UserCard";
import { Loader } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useMutation } from "@tanstack/react-query";
import { Tabs, Tab, User } from "@nextui-org/react";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  const [postTab, setPostTab] = useState(true)
  if (isSearchFetching) {
    return <Loader />;
  }
  else if (searchedPosts) {
    return (
      <div className="w-full">
        <Tabs size={"lg"} variant={"underlined"}>
          <Tab title="Posts">
            {searchedPosts.postResult.length>0 ?
              <GridPostList posts={searchedPosts.postResult} />
              :
              <p className="text-light-4 mt-10 text-center w-full">No results found</p>}
          </Tab>
          <Tab title="Accounts">
            {searchedPosts.userResult.length>0 ?
              <ul className="user-grid">
                {searchedPosts.userResult?.map((creator: any) => (
                  <li key={creator?.$id} className="flex-1 min-w-[200px] w-full">
                    <UserCard user={creator} />
                    <User className="" name={`${creator.firstName} ${creator.lastName}`} description={`@${creator.userName}`} avatarProps={creator.image||"/assets/icons/profile-placeholder.svg"}/>
                  </li>
                ))}
              </ul>
              :
              <p className="text-light-4 mt-10 text-center w-full">No results found</p>}
          </Tab>
        </Tabs>
      </div>
    )
  }
  else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const { ref, inView } = useInView()
  // const { data: posts, fetchNextPage, hasNextPage } = {data: [], fetchNextPage: ()=>console.log("fetchNextPage"), hasNextPage: false}
  const { data: posts, mutate: fetchNextPage, isPending: hasNextPage } = useMutation({
    mutationFn: (keyWord: string) => fetchPosts(keyWord),
    onSuccess: (value) => console.log(value)
  })

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isPending: isSearchFetching, mutate: fetchSearchedTerm } = useMutation({
    mutationFn: (keyWord: string) => fetchPosts(keyWord),
    onSuccess: (value) => console.log(value)
  })

  useEffect(() => {
    if (inView && searchValue === "") {
      fetchNextPage("home");
    }
    else if (searchValue.length >= 3) {
      const str = searchValue
      fetchSearchedTerm(str)
    }
  }, [inView, searchValue]);

  async function fetchPosts(keyWord: string) {
    console.log(keyWord)
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/explore/${keyWord}`)
    return await result.json()
  }

  if (!posts)
    return (
      <div className="flex-center w-full h-full" ref={ref}>
        <Loader />
      </div>
    );

  const shouldShowSearchResults = searchValue.length>=3;
  const shouldShowPosts = !shouldShowSearchResults && posts.status === 200

  return (
    <div className="explore-container" ref={ref}>
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          //   posts.pages.map((item, index) => (
          //     <GridPostList key={`page-${index}`} posts={item.documents} />
          //   ))
          <div>
            GridPostList
          </div>
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
