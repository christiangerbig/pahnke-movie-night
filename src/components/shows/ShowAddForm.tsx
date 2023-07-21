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
  Flex,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useMediaQuery } from "@mantine/hooks";
// zod
import { z } from "zod";
// dayjs
import dayjs from "../../dayjs.config";
// locales
import translations from "../../../public/locale/translations";
// components
import { Image as ImageIcon, UploadCloud, XCircle, Clock3 } from "lucide-react";
// types
import type { Database } from "~/lib/database.types";
import type { FileWithPath } from "@mantine/dropzone";
import type { Locale, StorageData } from "~/lib/general.types";

const supabaseAuthClient = createBrowserSupabaseClient<Database>();

interface AddShowFormProps {
  closeModal: () => void;
}

const AddShowForm = ({ closeModal }: AddShowFormProps) => {
  const [file, setFile] = useState<FileWithPath>();
  const { replace, asPath, locale } = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  // mantine
  const isBreakpointSM = useMediaQuery("(max-width: 48rem)");

  // Fetch component content for default language
  const {
    showAddForm: { schemaTexts, storage, preselection, addMovie },
  } = translations[locale as Locale];

  const schema = z
    .object({
      date: z.date().min(new Date(), {
        message: "Es muss ein Datum mindestens von morgen angegeben werden",
      }),
      time: z
        .string()
        .min(4, { message: schemaTexts.time.requirements.message }),
      title: z
        .string()
        .trim()
        .min(1, { message: schemaTexts.title.requirements.message }),
      youtubeLink: z
        .string()
        .trim()
        .min(1, { message: schemaTexts.link.requirements.message1 }),
      poster: z.object(
        {
          path: z.string(),
        },
        { required_error: schemaTexts.poster.requirements.message },
      ),
    })
    .superRefine(({ youtubeLink }, ctx) => {
      if (!youtubeLink.includes("https://youtu.be/")) {
        ctx.addIssue({
          message: schemaTexts.link.requirements.message2,
          code: z.ZodIssueCode.custom,
          path: ["youtubeLink"],
        });
      }
    });

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

  // submit
  interface HandleSubmitArgs {
    date: Date;
    time: string;
    title: string;
    youtubeLink: string;
    poster: FileWithPath | undefined;
  }

  const handleSubmit = async ({
    date,
    time,
    title,
    youtubeLink,
    poster,
  }: HandleSubmitArgs) => {
    const getStorage = async (value?: FileWithPath) => {
      if (!value) return { data: null, error: null };

      const { data, error } = await supabaseAuthClient.storage
        .from("posters")
        .upload(value.name, value);

      return { data, error };
    };

    const handleStorageError = (error: Error & { error?: string }) => {
      if (error.error === "Duplicate") {
        notifications.show({
          title: storage.doublet.errorNotification.title,
          message: storage.doublet.errorNotification.message,
          color: "red",
        });
      } else {
        notifications.show({
          title: storage.unknownError.errorNotification.title,
          message: error.message,
          color: "red",
        });
      }

      return;
    };

    const { data: storageData, error: storageError } = await getStorage(poster);

    if (storageError) {
      handleStorageError(storageError);
      return;
    }

    const storageUrl =
      "https://pkqfwvgswdthtmmgiaki.supabase.co/storage/v1/object/public/posters/";
    const index = youtubeLink.search(".be/");
    const mainYoutubeLink = youtubeLink.slice(index + 4);
    const playerString = `https://www.youtube-nocookie.com/embed/${mainYoutubeLink}?controls=1&autoplay=1&mute=1&loop=1&playlist=${mainYoutubeLink}`;

    const { data, error } = await supabaseAuthClient.from("shows").insert({
      date: dayjs(date).format("YYYY-MM-DD").toString(),
      time,
      movie_title: title,
      movie_poster: `${storageUrl}${(storageData as StorageData).path}`,
      movie_description: playerString,
    });

    if (error) {
      notifications.show({
        title: addMovie.errorNotification.title,
        message: error.message,
        color: "red",
      });
    } else {
      closeModal();
      void replace(asPath);
      notifications.show({
        title: addMovie.confirmNotification.title,
        message: addMovie.confirmNotification.message,
        color: "green",
      });
    }

    return data;
  };

  return (
    <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
      <Stack>
        <DatePickerInput
          label={preselection.date.label}
          defaultValue={new Date()}
          valueFormat="DD. MMMM YYYY"
          locale="de"
          maw="12rem"
          withAsterisk
          {...form.getInputProps("date")}
        />

        <TimeInput
          label={preselection.time.label}
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
          label={preselection.title.label}
          placeholder={preselection.title.placeholder}
          withAsterisk
          {...form.getInputProps("title")}
        />

        <TextInput
          label={preselection.link.label}
          placeholder={preselection.link.placeholder}
          withAsterisk
          {...form.getInputProps("youtubeLink")}
        />

        <Box>
          <Text size="sm" weight={500}>
            Poster{" "}
            <Text component="span" color="red">
              *
            </Text>
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
              sx={(theme) => ({
                borderColor: form.errors.poster ? theme.colors.red : "none",
                borderStyle: form.errors.poster ? "solid" : "none",
              })}
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
                    {preselection.image.text}
                  </Text>
                  <Text size="sm" color="dimmed" inline mt={7}>
                    {preselection.image.errorMessage}
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
          <Text component="div" color="red" size="xs" mt={4}>
            {form.errors.poster}
          </Text>
        </Box>
        <Flex justify="flex-end">
          <Button
            w={isBreakpointSM ? "25%" : "15%"}
            type="submit"
            color="blue.7"
            size="xs"
          >
            Speichern
          </Button>
        </Flex>
      </Stack>
    </form>
  );
};

export default AddShowForm;
