import { Community } from "@/atoms/communitiesAtom";
import CreatePostLink from "@/components/Community/CreatePostLink";
import Header from "@/components/Community/Header";
import NotFound from "@/components/Community/NotFound";
import PageContent from "@/components/Layout/PageContent";
import Posts from "@/components/Posts/Posts";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
  communityData: Community;
};

export default function CommunityPage({ communityData }: CommunityPageProps) {
  if (!communityData) {
    return <NotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>RHS</>
      </PageContent>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    const res = {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
      },
    };
    console.log("Community Data", res);
    return res;
  } catch (error) {
    console.log("getServerSideProps", error);
    // dummy for network error(fuck the firewall)
    return {
      props: {
        communityData: {
          id: "image",
          numberOfMembers: 1,
          creatorId: "NGWCvi1DDtMmoIPfjfVXDhCFBBs1",
          privacyType: "public",
        },
      },
    };
  }
}
