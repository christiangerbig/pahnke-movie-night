import { useRef, useState } from "react";
// next
import { useRouter } from "next/router";
import Image from "next/image";
// supabase
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
// mantine
import {
  Box,
  TextInput,
  Text,
  Group,
  rem,
  Button,
  Stack,
  ActionIcon,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
// zod
import { z } from "zod";
// dayjs
import dayjs from "../../dayjs.config";
// components
import { Image as ImageIcon, UploadCloud, XCircle, Clock3 } from "lucide-react";
// types
import type { Database } from "~/lib/database.types";
import type { FileWithPath } from "@mantine/dropzone";

const supabaseAuthClient = createBrowserSupabaseClient<Database>();

interface AddShowFormProps {
  closeModal: () => void;
}

const AddShowForm = ({ closeModal }: AddShowFormProps) => {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<FileWithPath>();

  // zod schema
  const schema = z
    .object({
      date: z.date().min(new Date(), {
        message: "Es muss ein Datum angegeben werden",
      }),
      time: z
        .string()
        .min(4, { message: "Es muss ein Datum angegeben werden" }),
      title: z
        .string()
        .trim()
        .min(1, { message: "Es muss ein Filmtitel angegeben werden" }),
      youtubeLink: z
        .string()
        .trim()
        .min(1, "Es muss ein Youtube-Link angegeben werden"),
    })
    .superRefine(({ youtubeLink }, ctx) => {
      if (!youtubeLink.includes("https://www.youtube.com/watch?")) {
        ctx.addIssue({
          message: "Es muss sich um einen Youtube-Link handeln",
          code: z.ZodIssueCode.custom,
          path: ["youtubeLink"],
        });
      }
    });

  // mantine hooks
  const form = useForm({
    initialValues: {
      title: "",
      time: "",
      date: dayjs().toDate(),
      poster: undefined as FileWithPath | undefined,
      youtubeLink: "",
    },
    validate: zodResolver(schema),
  });

  const getStorate = async (value?: FileWithPath) => {
    if (!value) return { data: null, error: null };

    const { data, error } = await supabaseAuthClient.storage
      .from("posters")
      .upload(value.name, value);

    return { data, error };
  };

  const handleStorageError = (error: Error & { error?: string }) => {
    if (error.error === "Duplicate") {
      notifications.show({
        title: "Ups ...",
        message: "Das Bild exisitert bereits unter diesem Namen.",
        color: "red",
      });
    } else {
      notifications.show({
        title: "Ups ...",
        message: error.message,
        color: "red",
      });
    }

    return;
  };

  // submit
  const handleSubmit = async (values: {
    date: Date;
    time: string;
    title: string;
    youtubeLink: string;
    poster: FileWithPath | undefined;
  }) => {
    console.log(values.poster);
    const { data: storageData, error: storageError } = await getStorate(
      values.poster,
    );

    if (storageError) {
      handleStorageError(storageError);
      return;
    }

    const storageUrl =
      // "https://yzybkfpayferkdiafjdj.supabase.co/storage/v1/object/public/posters/";
      "https://pkqfwvgswdthtmmgiaki.supabase.co/storage/v1/object/public/posters/";

    const entry = {
      date: dayjs(values.date).format("YYYY-MM-DD").toString(),
      time: values.time,
      movie_title: values.title,
      movie_poster: storageData ? `${storageUrl}${storageData.path}` : null,
      movie_description: values.youtubeLink,
    };

    const { data, error } = await supabaseAuthClient
      .from("shows")
      .insert(entry);

    if (error) {
      notifications.show({
        title: "Ups ...",
        message: error.message,
        color: "red",
      });
    } else {
      closeModal();
      void router.replace(router.asPath);
      notifications.show({
        title: "Yeah!",
        message: "Show wurde hinzugefügt",
        color: "green",
      });
    }

    return data;
  };

  return (
    <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
      <Stack>
        <DatePickerInput
          label="Datum"
          defaultValue={new Date()}
          valueFormat="DD. MMMM YYYY"
          locale="de"
          maw="12rem"
          withAsterisk
          {...form.getInputProps("date")}
        />

        <TimeInput
          label="Uhzeit"
          ref={ref}
          rightSection={
            <ActionIcon
              onClick={() => (ref.current as HTMLInputElement).showPicker()}
            >
              <Clock3 size="1rem" />
            </ActionIcon>
          }
          maw="12rem"
          withAsterisk
          {...form.getInputProps("time")}
        />

        <TextInput
          label="Filmtitel"
          placeholder="Titel ..."
          withAsterisk
          {...form.getInputProps("title")}
        />

        <TextInput
          label="You tube link"
          placeholder="Link ..."
          withAsterisk
          {...form.getInputProps("youtubeLink")}
        />

        <Box>
          <Text size="sm" weight={500}>
            Poster
          </Text>

          {file ? (
            <Box pos="relative" w="100%" h={300}>
              <Image
                src={URL.createObjectURL(file)}
                alt=""
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          ) : (
            <Dropzone
              onDrop={(files) => {
                form.setFieldValue("poster", files[0]);
                setFile(files[0]);
                console.log("accepted files", files);
              }}
              onReject={(files) => console.log("rejected files", files)}
              maxSize={3 * 1024 ** 2}
              multiple={false}
              accept={IMAGE_MIME_TYPE}
            >
              <Group
                position="center"
                spacing="xl"
                style={{ minHeight: rem(220), pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <UploadCloud size={44} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <XCircle size={44} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <ImageIcon size={44} />
                </Dropzone.Idle>

                <div>
                  <Text size="xl" inline>
                    Drag&apos;n&apos;drop oder klicke um ein Bild auszuwählen
                  </Text>
                  <Text size="sm" color="dimmed" inline mt={7}>
                    Das Bild darf nicht größer als 5MB sein
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
        </Box>

        <Button type="submit" color="indigo">
          Speichern
        </Button>
      </Stack>
    </form>
  );
};

export default AddShowForm;
