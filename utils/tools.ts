import { Applicant } from "@prisma/client";

//@ts-ignore
export const fetcher = (...args: Array<any>) => fetch(...args).then((res) => res.json());
export function validateResponse(response: Applicant): boolean {
    const errorList: Array<string> = []
    console.log(response)
    if (response.name.trim() == "") {
        errorList.push("form-name")
    }
    if (response.preferredAges.trim() == "") {
        errorList.push("form-preferred-ages")
    }
    if (response.preferredGenders.trim() == "") {
        errorList.push("form-preferred-gender")
    }
    if (response.location.trim() == "") {
        errorList.push("form-location")
    }
    if (response.aboutYou.trim() == "") {
        errorList.push("form-about-yourself")
    }
    if (response.hobbies.trim() == "") {
        errorList.push("form-hobbies")
    }
    if (response.idealDesc.trim() == "") {
        errorList.push("form-ideal-mate")
    }

    if (errorList.length == 0) return true;

    for (const e of document.getElementsByClassName("form-question")) {
        const elm = e as HTMLDivElement;
        if (errorList.includes(elm.id)) {
            elm.style.backgroundColor = "rgba(255,0,0,50)"
        }
    }
    document.getElementById(errorList[0]).scrollIntoView({ behavior: "smooth" });
    return false;
}

export function clearInvalid(elm:HTMLElement) {
    elm.style.backgroundColor = "rgba(0,0,0,0)"
}