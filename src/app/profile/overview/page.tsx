
import ProfileOverviewPage from "@/components/client/Profile/ProfileOverview";
import { ProfilePage } from "@/components/client/Profile/ProfilePage";

export default async function Page({
    searchParams,
  }: {
    searchParams: Promise<{ section?: string }>;
  }){

    const { section } = await searchParams;
    

    
    return (
        <>
        <ProfileOverviewPage section={section} />
        <ProfilePage/>
        </>
        
    );
  }

 
