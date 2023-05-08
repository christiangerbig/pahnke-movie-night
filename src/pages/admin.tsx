import type { GetServerSideProps, NextPage } from "next";
import {
  Box,
  Container,
  TextInput,
  Text,
  Title,
  Group,
  rem,
  Button,
  Stack,
  Grid,
  Table,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import Image from "next/image";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  type FileWithPath,
} from "@mantine/dropzone";
import {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { isNotEmpty, useForm } from "@mantine/form";
import dayjs from "dayjs";
import { Image as ImageIcon, UploadCloud, XCircle } from "lucide-react";
import "dayjs/locale/de";

import type { Database } from "~/lib/database.types";
import { notifications } from "@mantine/notifications";

const supabaseAuthClient = createBrowserSupabaseClient<Database>();

interface PropTypes {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
}

const AdminPage: NextPage<PropTypes> = ({ shows }) => {
  const [file, setFile] = useState<FileWithPath>();

  const form = useForm({
    initialValues: {
      title: "",
      date: dayjs().toDate(),
      poster: undefined as FileWithPath | undefined,
    },

    validate: {
      title: isNotEmpty("Es muss ein Filmtitel angegeben werden"),
      date: isNotEmpty("Es muss ein Datum angegeben werden"),
    },
  });

  console.log(shows);

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

  const handleSubmit = async (values: {
    date: Date;
    title: string;
    poster: FileWithPath | undefined;
  }) => {
    const { data: storageData, error: storageError } = await getStorate(
      values.poster,
    );

    if (storageError) {
      handleStorageError(storageError);
      return;
    }

    const storageUrl =
      "https://yzybkfpayferkdiafjdj.supabase.co/storage/v1/object/public/posters/";

    const { data, error } = await supabaseAuthClient.from("shows").insert({
      date: values.date.toString(),
      movie_title: values.title,
      movie_poster: storageData ? `${storageUrl}${storageData.path}` : null,
    });

    if (error) {
      notifications.show({
        title: "Ups ...",
        message: error.message,
        color: "red",
      });
    }

    notifications.show({
      title: "Yeah!",
      message: "Show wurde hinzugefügt",
      color: "green",
    });

    return data;
  };

  return (
    <Box component="main" my="xl">
      <Container>
        <Table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Filmtitel</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => (
              <tr key={show.id}>
                <td>{dayjs(show.date).format("DD MMMM YYYY")}</td>
                <td>{show.movie_title}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Title mb="xl">Neue Show hinzufügen</Title>
        <form onSubmit={form.onSubmit((values) => void handleSubmit(values))}>
          <Stack>
            <TextInput
              label="Filmtitel"
              placeholder="Titel ..."
              withAsterisk
              {...form.getInputProps("title")}
            />

            <DatePickerInput
              label="Datum"
              defaultValue={new Date()}
              valueFormat="DD. MMMM YYYY"
              locale="de"
              withAsterisk
              {...form.getInputProps("date")}
            />

            <Box>
              <Text size="sm" weight={500}>
                Poster
              </Text>
              <Grid grow>
                <Grid.Col span="content">
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
                          Drag&apos;n&apos;drop oder klicke um ein Bild
                          auszuwählen
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                          Das Bild darf nicht größer als 5MB sein
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                </Grid.Col>
                <Grid.Col span="auto">
                  {file && (
                    <Box pos="relative" w="100%" h="100%">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt=""
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </Box>
                  )}
                </Grid.Col>
              </Grid>
            </Box>

            <Button type="submit">Speichern</Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabaseAuthServer = createServerSupabaseClient<Database>(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabaseAuthServer.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const { data: shows } = await supabaseAuthServer.from("shows").select();

  return {
    props: {
      initialSession: session,
      user: session.user,
      shows,
    },
  };
};
