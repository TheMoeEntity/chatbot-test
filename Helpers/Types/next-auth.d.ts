import nextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
      user: {
        access:string,
        id:string,
        email:string,
        matric_number:string,
        hostel:string,
        first_name:string,
        last_name:string,
        is_student:boolean,
        is_porter:boolean,
        is_superuser:boolean,
        is_staff:boolean,
        refresh:string
      }
    }
}