"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { ProductFilterSchema } from "@/schemas";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProductFilterForm({ className, brands }) {
    const [brandsSplice, setBrandsSplice] = useState([]);

    useEffect(() => {
        if (brands.length) {
            const copyBrands = brands.slice();
            setBrandsSplice((prev) => copyBrands.splice(0, 10));
        }
    }, [brands]);

    const handleClickShowMore = () => {
        setBrandsSplice((prev) => {
            const prevBrands = prev.slice();
            const newSplice = brands.slice().splice(prev.length, 10);
            return [...prevBrands, ...newSplice];
        });
    };

    const handleClickReset = () => {
        form.reset();
    };

    const form = useForm({
        resolver: zodResolver(ProductFilterSchema),
        defaultValues: {
            brands: [],
            price: 0,
        },
    });

    const onSubmit = async (values) => {
        console.log(values);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("space-y-4", className)}
            >
                <FormField
                    control={form.control}
                    name="brands"
                    render={() => (
                        <FormItem>
                            <FormLabel className="block mb-4 text-base">
                                Бренд
                            </FormLabel>
                            {brandsSplice.map((brand) => (
                                <FormField
                                    key={brand.id}
                                    control={form.control}
                                    name="brands"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(
                                                            brand.id
                                                        )}
                                                        size="size-3.5"
                                                        onCheckedChange={(
                                                            checked
                                                        ) => {
                                                            return checked
                                                                ? field.onChange(
                                                                      [
                                                                          ...field?.value,
                                                                          brand.id,
                                                                      ]
                                                                  )
                                                                : field.onChange(
                                                                      field.value?.filter(
                                                                          (
                                                                              value
                                                                          ) =>
                                                                              value !==
                                                                              brand.id
                                                                      )
                                                                  );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-xs font-normal cursor-pointer">
                                                    {brand.label}
                                                </FormLabel>
                                            </FormItem>
                                        );
                                    }}
                                />
                            ))}
                            {brands.length !== brandsSplice.length && (
                                <Button
                                    type="button"
                                    variant="link"
                                    size="sm"
                                    onClick={handleClickShowMore}
                                >
                                    Показать ещё...
                                </Button>
                            )}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block mb-4 text-base">
                                Цена
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="100.0"
                                    className="h-8 text-xs"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" size="sm" className="mr-2.5">
                    Применить
                </Button>
                <Button
                    type="reset"
                    variant="outline"
                    size="sm"
                    onClick={handleClickReset}
                >
                    Сбросить
                </Button>
            </form>
        </Form>
    );
}

function ProductFilterLayout({ className, children }) {
    return <div className={cn("", className)}>{children}</div>;
}
