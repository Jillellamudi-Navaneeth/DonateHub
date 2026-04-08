package com.donation.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            return null;
        }

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", folder));
        
        return (String) uploadResult.get("secure_url");
    }

    public void deleteFile(String imageUrl) throws IOException {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            return;
        }
        
        // Extract public_id from URL: .../upload/v15912345/folder/public_id.jpg
        try {
            String[] parts = imageUrl.split("/");
            String fileNameWithExtension = parts[parts.length - 1];
            String publicId = fileNameWithExtension.split("\\.")[0];
            
            // If there's a folder (e.g., /gallery_images/public_id), we need the folder name too
            String folderName = parts[parts.length - 2];
            if (!folderName.equals("upload") && !folderName.startsWith("v")) {
                publicId = folderName + "/" + publicId;
            }

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            System.err.println("Failed to extract publicId from Cloudinary URL: " + imageUrl);
        }
    }
}
