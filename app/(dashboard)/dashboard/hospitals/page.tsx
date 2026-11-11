"use client"

import { hospitalConfig } from "@/features/directory/config"
import DirectoryPageUI from "@/features/directory/DirectoryPageUI"

const page = () => <DirectoryPageUI config={hospitalConfig} />

export default page
