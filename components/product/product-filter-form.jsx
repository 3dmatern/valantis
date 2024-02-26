"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";

import { cn } from "@/lib/utils";
import { ProductFilterSchema } from "@/schemas";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProductFilterForm({
    className,
    brands,
    onClickApplyFilter,
    onClickResetFilter,
}) {
    const [brandsSplice, setBrandsSplice] = useState([]);
    const form = useForm({
        resolver: zodResolver(ProductFilterSchema),
        defaultValues: {
            product: "",
            brand: [],
            price: "",
        },
    });

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
        onClickResetFilter();
    };

    const onSubmit = (values) => {
        onClickApplyFilter(values);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("space-y-4", className)}
            >
                <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block mb-4 text-base">
                                Название
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Золотое кольцо"
                                    disabled={brands.length === 0}
                                    className="h-8 text-xs"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="brand"
                    render={() => (
                        <FormItem>
                            <FormLabel className="block mb-4 text-base">
                                Бренд
                            </FormLabel>
                            {brands.length > 0 ? (
                                brandsSplice.map((brand) => (
                                    <FormField
                                        key={brand.id}
                                        control={form.control}
                                        name="brand"
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
                                ))
                            ) : (
                                <BeatLoader size={10} className="text-center" />
                            )}
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
                            <FormMessage />
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
                                    step="1"
                                    min="0"
                                    placeholder="100"
                                    disabled={brands.length === 0}
                                    className="h-8 text-xs"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    size="sm"
                    disabled={!form.formState.isValid || brands.length === 0}
                    className="mr-2.5"
                >
                    Применить
                </Button>
                <Button
                    type="reset"
                    variant="outline"
                    size="sm"
                    disabled={!form.formState.isValid || brands.length === 0}
                    onClick={handleClickReset}
                >
                    Сбросить
                </Button>
            </form>
        </Form>
    );
}
