import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Promo } from "@/components/promo";
import { quests } from "@/constants";
import WalletActions from "@/components/WalletActions";

export const dynamic = "force-dynamic"; 

const QuestsPage = async () => {
  // Fetch user progress and subscription data on the server
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

 
  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      {/* Sidebar showing user's progress and promo */}
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
      </StickyWrapper>

      {/* Main content for quests and wallet actions */}
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image src="/quests.svg" alt="quests" width={90} height={90} />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Quests
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            Complete Quests by earning points
          </p>

          {/* Server-side WalletActions component handling wallet and minting functionality */}
          <WalletActions quests={quests} userProgress={userProgress} />

          {/* List of Quests */}
          <ul className="w-full mt-4">
            {quests.map((quest) => {
              const progress = (userProgress.points / quest.points) * 100;

              return (
                <div
                  className="flex items-center w-full p-4 gap-x-4 border-t-2"
                  key={quest.title}
                >
                  <Image src="/points.svg" alt="points" width={60} height={60} />
                  <div className="flex flex-col gap-y-2 w-full">
                    <p className="text-neutral-700 text-xl font-bold">
                      {quest.title}
                    </p>
                    <Progress value={progress} className="h-3" />
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
