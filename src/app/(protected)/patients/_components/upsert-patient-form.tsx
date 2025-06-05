"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";

import { upsertPatient } from "@/actions/upsert-patient";
import {
  UpsertPatientInput,
  upsertPatientSchema,
} from "@/actions/upsert-patient/schema";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpsertPatientFormProps {
  patient?: UpsertPatientInput;
  onSuccess?: () => void;
  onCancel?: () => void;
  isOpen?: boolean;
}

export function UpsertPatientForm({
  patient,
  onSuccess,
  onCancel,
  isOpen,
}: UpsertPatientFormProps) {
  const form = useForm<UpsertPatientInput>({
    resolver: zodResolver(upsertPatientSchema),
    defaultValues: patient || {
      name: "",
      email: "",
      phoneNumber: "",
      sex: "male",
    },
  });

  const { execute, status } = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success(patient ? "Paciente atualizado!" : "Paciente cadastrado!");
      onSuccess?.();
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Algo deu errado!");
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    execute(data);
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(patient);
    }
  }, [isOpen, form, patient]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar paciente</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do paciente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="E-mail do paciente"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    customInput={Input}
                    placeholder="(00) 00000-0000"
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={status === "executing"}>
              {patient ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
