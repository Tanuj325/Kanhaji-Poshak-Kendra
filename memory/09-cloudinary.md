# CLOUDINARY - Complete Analysis

## Configuration (`config/CloudinaryConfig.java`)
Creates `Cloudinary` bean from:
- `cloudinary.cloud-name`
- `cloudinary.api-key`  
- `cloudinary.api-secret`

## Service (`service/CloudinaryService.java`)

### Folder Structure
| Entity | Folder | Notes |
|---|---|---|
| User Profiles | `krishanaposhak/profiles/` | Profile images |
| Products | `krishanaposhak/products/` | Product gallery images |
| Banners | `krishanaposhak/banners/` | Banner/slider images |

### Operations

#### Upload File
```
uploadFile(MultipartFile file, String folder) → Map
```
- Extracts original filename
- Uploads to specified folder
- Returns Cloudinary response map (contains `url`, `public_id`, etc.)

#### Delete File
```
deleteFile(String publicId) → void
```
- Deletes file by public_id
- Used when removing images

#### Update File
```
updateFile(MultipartFile file, String folder, String oldPublicId) → Map
```
- Deletes old file by public_id
- Uploads new file
- Returns upload response

### Usage in Application

#### User Profile Image
1. `UserController.updateProfile()` receives `UpdateProfileRequest` with file
2. If file present: `cloudinaryService.updateFile(file, "profiles", oldPublicId)`
3. Updates `User.profileImageUrl` and `User.profileImagePublicId`

#### Product Images
1. `ProductImageController.addImage()` receives `ProductImageRequest` with file
2. `cloudinaryService.uploadFile(file, "products")`
3. Creates `ProductImage` entity with url and publicId

#### Banner Images
1. `BannerController.createBanner()` receives `BannerRequest` with file
2. `cloudinaryService.uploadFile(file, "banners")`
3. Creates `Banner` entity with imageUrl and publicId

### Error Handling
- `FileStorageException` thrown on upload/delete failures
- Extends `BusinessException` → 422 Unprocessable Entity

### Fields Stored
| Entity | URL Field | Public ID Field |
|---|---|---|
| User | `profileImageUrl` | `profileImagePublicId` |
| ProductImage | `imageUrl` | `publicId` |
| Banner | `imageUrl` | `publicId` |

