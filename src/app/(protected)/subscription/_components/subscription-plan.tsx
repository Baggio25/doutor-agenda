"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { createStripeCheckout } from "@/actions/create-stripe-checkout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SubscriptionPlanProps {
  active?: boolean;
  userEmail?: string;
}

export default function SubscriptionPlan({
  active = false,
  userEmail,
}: SubscriptionPlanProps) {
  const router = useRouter();
  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: async ({ data }) => {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key is not set");
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );

      if (!stripe) {
        throw new Error("Stripe is not loaded");
      }

      if (!data?.sessionId) {
        throw new Error("Session ID is not set");
      }

      await stripe.redirectToCheckout({ sessionId: data?.sessionId });
    },
  });

  const features = [
    "Cadastro de até 3 médicos",
    "Agendamentos ilimitados",
    "Métricas básicas",
    "Cadastro de pacientes",
    "Confirmação manual",
    "Suporte via e-mail",
    "Exportação em CSV",
  ];

  const handleSubscribeClick = async () => {
    createStripeCheckoutAction.execute();
  };

  const handleManagePlanClick = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL}?prefilled_email=${userEmail}`,
    );
  };

  return (
    <Card className="w-full max-w-sm border border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Essential
            </CardTitle>
            <CardDescription className="leading-relaxed text-gray-600">
              Para profissionais autônomos ou pequenas clínicas
            </CardDescription>
          </div>
          {active && (
            <Badge
              variant="secondary"
              className="bg-emerald-100 px-3 py-1 font-medium text-emerald-500 hover:bg-emerald-100"
            >
              Atual
            </Badge>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-gray-900">R$59</span>
            <span className="ml-2 text-gray-500">/ mês</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-8 space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <Button
          className="w-full cursor-pointer bg-gray-900 py-3 font-medium text-white hover:bg-gray-800"
          size="lg"
          onClick={active ? handleManagePlanClick : handleSubscribeClick}
          disabled={createStripeCheckoutAction.isExecuting}
        >
          {createStripeCheckoutAction.isExecuting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : active ? (
            "Gerenciar Assinatura"
          ) : (
            "Fazer assinatura"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
