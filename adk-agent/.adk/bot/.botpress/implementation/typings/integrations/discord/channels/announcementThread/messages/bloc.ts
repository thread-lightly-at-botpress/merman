/* eslint-disable */
/* tslint:disable */
// This file is generated. Do not edit it manually.

export type Bloc = {
  items: Array<
    | { type: "text"; payload: { text: string } }
    | { type: "image"; payload: { imageUrl: string; title?: string } }
    | { type: "audio"; payload: { audioUrl: string; title?: string } }
    | { type: "video"; payload: { videoUrl: string; title?: string } }
    | { type: "file"; payload: { fileUrl: string; title?: string } }
    | {
        type: "location";
        payload: {
          latitude: number;
          longitude: number;
          address?: string;
          title?: string;
        };
      }
    | {
        type: "dropdown";
        payload: {
          text: string;
          options: Array<{
            label: string;
            value: string;
            description?: string;
          }>;
          id: string;
        };
      }
    | {
        type: "choice";
        payload: {
          title?: string;
          options: Array<{
            label: string;
            value: string;
            style?: "primary" | "secondary" | "success" | "danger";
          }>;
        };
      }
    | {
        type: "card";
        payload: {
          title: string;
          subtitle?: string;
          imageUrl?: string;
          actions: Array<{
            action: "postback" | "url" | "say";
            label: string;
            value: string;
          }>;
        };
      }
    | {
        type: "carousel";
        payload: {
          items: Array<{
            title: string;
            subtitle?: string;
            imageUrl?: string;
            actions: Array<{
              action: "postback" | "url" | "say";
              label: string;
              value: string;
            }>;
          }>;
        };
      }
    | {
        type: "rawComponents";
        payload: {
          /** An array of JSON strings that represent Discord components */
          components: string[];
          /** File URLs to attach, referenced in the components JSON as attachment://file-0.<ext>, attachment://file-1.<ext>, etc. */
          fileUrls?: string[];
        };
      }
  >;
};
