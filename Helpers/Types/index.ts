import { authOptions } from "@/lib/auth";
import Cookies from "js-cookie";
import { getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { Cookie } from "next/font/google";
import { redirect } from "next/navigation";
import { cache } from "react";
type myFunc = (message: string, sucess: boolean) => void;
export const config = {
  runtime: "edge",
};
export interface Session {
  user: {
    access: string;
    id: string;
    email: string;
    matric_number: string;
    hostel: string;
    first_name: string;
    last_name: string;
    is_student: boolean;
    is_porter: boolean;
    is_superuser: boolean;
    is_staff: boolean;
    refresh: string;
  };
}
export type postTypes = {
  title: string;
  body: string;
  id: number;
};
export type payload = {
  access: string;
  id: string;
  email: string;
  matric_number: string;
  hostel: string;
  first_name: string;
  last_name: string;
  is_student: boolean;
  is_porter: boolean;
  is_superuser: boolean;
  is_staff: boolean;
  refresh: string;
};
enum categories {
  light_issues = "fa-solid fa-lightbulb",
  water_issues = "fa-solid fa-droplet",
  theft = "fa-solid fa-person-through-window",
  others = "fa-solid fa-circle-info",
  bed_bug = "fa-solid fa-bug",
}
export const catIcons: { title: string; icon: string }[] = [
  {
    title: "Light issues",
    icon: categories.light_issues,
  },
  {
    title: "Water Issues",
    icon: categories.water_issues,
  },
];
export const options: string[] = [
  "KING-JAJA HOSTEL",
  "BIOBAKU HALL",
  "ENI NJOKU HALL",
  "MS MARIERE",
  "SODEINDE HALL",
  "EL-KANEMI HALL",
];
export type studType = {
  faculty: string | null | undefined;
  department: string | null;
  students_details: {
    first_name: string | null;
    last_name?: string | null;
    matric_number?: string | null;
  };
  block_no: string | null;
  room_no: string | null;
};
export type porterType = {
  porter_details: {
    email: string | null;
    first_name: string | null;
    last_name: string | null;
  };
};
export const assets: {
  icon: string;
  title: string;
  link: `/dashboard` | "/students" | "/complaints" | "/porters";
}[] = [
  {
    icon: "fa-solid fa-gauge",
    title: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: "fa-solid fa-person",
    title: "Porters",
    link: "/porters",
  },
  {
    icon: "fas fa-graduation-cap",
    title: "Students",
    link: "/students",
  },
];
export class Helpers {
  static async getHostels(url: string) {
    let hostels: any;
    fetch(url)
      .then(async (res) => {
        const isJson = res.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await res.json() : null;

        if (!res.ok) {
          const error = (data && data.message) || res.status;

          return Promise.reject(error);
        } else if (res.ok) {
          hostels = data;
        }
      })
      .catch((err) => {
        return JSON.stringify(err);
      });
    return hostels;
  }
  static fetchData = cache(async (url: string) => {
    const session = await getServerSession(authOptions);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + session?.user.access,
        },
      });
      if (res.status === 404) {
        return undefined;
      }
      if (res.status === 401) {
        const refresh = await this.getRefresh();
        if (session) session.user.access = refresh.access;
        const newToken = refresh.access;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: "Bearer " + refresh.access,
          },
        });
        if (!res.ok) {
          redirect("/login");
        }
        return res.json();
      }
      return res.json();
    } catch (error) {
      redirect("/serverError?error=" + error);
    }
  });
  static setNewToken = async (token: string) => {
    const { data: session, update } = useSession();

    await update({
      ...session,
      user: {
        ...session?.user,
        access: token,
      },
    });
  };
  static firstTen = (word: string, n: number, s: number): string => {
    return word.slice(s, n);
  };
  static getRefreshClient = async (session: Session) => {
    const url =
      "https://hostelcomplaintsmanagementsystem.onrender.com/api/auth/login/refresh/";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: session?.user.refresh }),
    });
    if (res.status === 401 || !res.ok) {
      location.href = "/login";
    }

    return res.json();
  };
  static getRefresh = async () => {
    const session = await getServerSession(authOptions);
    const url =
      "https://hostelcomplaintsmanagementsystem.onrender.com/api/auth/login/refresh/";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: session?.user.refresh }),
    });
    if (res.status === 401 || !res.ok) {
      signIn();
    }

    return res.json();
  };

  static createComplaint = async (
    session: Session | null,
    body: { title: string; is_resolved: boolean; description: string },
    update: any,
    snackbar: myFunc
  ) => {
    let accessToken;
    try {
      accessToken = session?.user.access;
      await fetch("./api/create/", {
        method: "POST",
        mode: "no-cors",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify(body),
      }).then(async (res) => {
        const isJson = res.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson ? await res.json() : null;
        if (res.status == 401) {
          if (session) {
            const newToken = await this.getRefreshClient(session);

            await update({
              ...session,
              user: {
                ...session?.user,
                access: newToken.access,
              },
            });
            await fetch("./api/create/", {
              method: "POST",
              headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                Authorization: "Bearer " + newToken.access,
              },
              body: JSON.stringify(body),
            });
          }
        }
        if (!res.ok) {
          const error = (data && data.message) || res.statusText;
          snackbar(
            "Failed to send complaints: " + JSON.parse(data).message,
            false
          );

          return Promise.reject(error);
        } else if (res.ok || res.status === 201 || res.status === 200) {
          snackbar(
            "Your complaints have been successfully lodged and is being processed.",
            true
          );
        }
      });
    } catch (error) {
      snackbar("Failed to send complaints: " + error, false);
    }
  };
  static unique(a: any, fn: any) {
    if (a.length === 0 || a.length === 1) {
      return a;
    }
    if (!fn) {
      return a;
    }

    for (let i = 0; i < a.length; i++) {
      for (let j = i + 1; j < a.length; j++) {
        if (fn(a[i], a[j])) {
          a.splice(i, 1);
        }
      }
    }
    return a;
  }
  static showError(type: string) {
    switch (type) {
      case "email":
        break;

      default:
        break;
    }
  }
}
