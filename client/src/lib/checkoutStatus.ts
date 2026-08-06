import { checkoutOffers, isPracticePackOffer } from "@shared/commerce/offers";

export interface CheckoutStatus {
  tone: "success" | "notice";
  title: string;
  message: string;
  nextSteps: string[];
  action: {
    label: string;
    href: string;
  };
}

function isPracticeCheckoutReturn(params: URLSearchParams): boolean {
  const offerId = params.get("offer");
  const offer = checkoutOffers.find(checkoutOffer => {
    return checkoutOffer.id === offerId;
  });

  return offer ? isPracticePackOffer(offer) : false;
}

export function getCheckoutStatus(search: string): CheckoutStatus | null {
  const params = new URLSearchParams(search);
  const status = params.get("checkout");
  const isPracticeReturn = isPracticeCheckoutReturn(params);

  if (status === "success") {
    if (isPracticeReturn) {
      return {
        tone: "success",
        title: "Practice pack payment received",
        message:
          "Stripe confirmed the practice pack payment. Your seat pack is being prepared for learner assignment and onboarding setup.",
        nextSteps: [
          "Check the billing email for the Stripe receipt.",
          "Gather the learner emails that should receive seats.",
          "Use the protected practice setup process to assign seats when ready.",
          "Do not send patient information, passwords, or private staff details in setup notes.",
        ],
        action: {
          label: "Open seat setup tools",
          href: "/practice-seat-admin",
        },
      };
    }

    return {
      tone: "success",
      title: "Payment received",
      message:
        "Stripe confirmed your payment. Use the same checkout email to request a sign-in link, then open Module 1 from your learner account.",
      nextSteps: [
        "Check your email for the Stripe receipt.",
        "Request a passwordless sign-in link with the email used at checkout.",
        "Open Module 1 after your learner access is confirmed.",
        "Do not share patient information in course forms or support requests.",
      ],
      action: {
        label: "Request sign-in and start Module 1",
        href: "/learn",
      },
    };
  }

  if (status === "cancelled") {
    return {
      tone: "notice",
      title: "Checkout canceled",
      message:
        "No payment was taken. You can review the offer and restart checkout when ready.",
      nextSteps: [
        isPracticeReturn
          ? "Return to the practice pack options when you are ready to buy seats."
          : "Return to checkout when you are ready to enroll.",
      ],
      action: isPracticeReturn
        ? {
            label: "Return to practice packs",
            href: "/practice-packs",
          }
        : {
            label: "Return to checkout",
            href: "/checkout",
          },
    };
  }

  return null;
}
